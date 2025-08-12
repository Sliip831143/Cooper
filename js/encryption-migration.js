// 既存データの暗号化移行スクリプト

async function checkAndMigrateEncryption() {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
        // 移行済みフラグをチェック
        const migrationKey = `encryption_migrated_${user.uid}`;
        if (localStorage.getItem(migrationKey) === 'true') {
            return; // すでに移行済み
        }
        
        // 暗号化されていないデータが存在するかチェック
        const contactsRef = getUserCollection(user.uid);
        const snapshot = await contactsRef.limit(1).get();
        
        if (!snapshot.empty) {
            const firstDoc = snapshot.docs[0].data();
            
            // _encryptedフラグがない場合は未暗号化データ
            if (!firstDoc._encrypted) {
                const shouldMigrate = confirm(
                    '重要なお知らせ：セキュリティ強化のため、個人情報の暗号化を開始します。\n' +
                    '既存のデータを暗号化しますか？\n\n' +
                    '注意：この処理には時間がかかる場合があります。'
                );
                
                if (shouldMigrate) {
                    await migrateExistingData(user.uid);
                    localStorage.setItem(migrationKey, 'true');
                    alert('データの暗号化が完了しました。');
                } else {
                    alert('暗号化をスキップしました。次回ログイン時に再度確認されます。');
                }
            } else {
                // すでに暗号化されている
                localStorage.setItem(migrationKey, 'true');
            }
        }
    } catch (error) {
        console.error('暗号化移行チェックエラー:', error);
    }
}

// 既存データを暗号化
async function migrateExistingData(userId) {
    try {
        // プログレス表示
        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
        `;
        progressDiv.innerHTML = `
            <h3>データを暗号化しています...</h3>
            <p id="migrationProgress">0%</p>
            <div style="width: 200px; height: 20px; background: #f0f0f0; border-radius: 10px;">
                <div id="progressBar" style="width: 0%; height: 100%; background: #1D9BF0; border-radius: 10px; transition: width 0.3s;"></div>
            </div>
        `;
        document.body.appendChild(progressDiv);
        
        // 暗号化キーを初期化
        await keyManager.initializeUserKey(userId);
        const key = keyManager.getKey();
        
        // すべての連絡先を取得
        const contactsRef = getUserCollection(userId);
        const querySnapshot = await contactsRef.get();
        const total = querySnapshot.size;
        let processed = 0;
        
        // バッチ処理で暗号化
        const batch = db.batch();
        
        for (const doc of querySnapshot.docs) {
            const contact = doc.data();
            
            // すでに暗号化されている場合はスキップ
            if (contact._encrypted) {
                processed++;
                continue;
            }
            
            // 暗号化
            const encryptedContact = await cryptoUtils.encryptSensitiveFields(contact, key);
            
            // バッチ更新
            batch.update(doc.ref, encryptedContact);
            
            processed++;
            
            // プログレス更新
            const progress = Math.round((processed / total) * 100);
            document.getElementById('migrationProgress').textContent = `${progress}%`;
            document.getElementById('progressBar').style.width = `${progress}%`;
            
            // UIの更新を反映させるため少し待機
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        // バッチコミット
        await batch.commit();
        
        // プログレス表示を削除
        document.body.removeChild(progressDiv);
        
    } catch (error) {
        console.error('データ移行エラー:', error);
        throw error;
    }
}

// localStorage の暗号化移行
async function migrateLocalStorageEncryption() {
    try {
        const oldData = localStorage.getItem('persons');
        if (!oldData) return;
        
        const persons = JSON.parse(oldData);
        if (persons.length === 0) return;
        
        // 暗号化されているかチェック
        const testKey = 'persons_encrypted_test';
        const encrypted = await secureStorage.getItem(testKey);
        if (encrypted !== null) {
            // すでに暗号化システムが使用されている
            return;
        }
        
        const shouldEncrypt = confirm(
            'ローカルに保存されているデータを暗号化しますか？\n' +
            'セキュリティ向上のため、暗号化を推奨します。'
        );
        
        if (shouldEncrypt) {
            // 暗号化して保存
            await secureStorage.setItem('persons', persons);
            // 古いデータを削除
            localStorage.removeItem('persons');
            alert('ローカルデータの暗号化が完了しました。');
        }
    } catch (error) {
        console.error('ローカルストレージ移行エラー:', error);
    }
}