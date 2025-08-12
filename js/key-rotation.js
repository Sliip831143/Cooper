// 暗号化キーのローテーション管理
// 定期的にキーを更新してセキュリティを強化

class KeyRotationManager {
    constructor() {
        this.rotationInterval = 90; // デフォルト90日
        this.rotationCheckKey = 'cooper_key_rotation_check';
        this.lastRotationKey = 'cooper_last_key_rotation';
        this.rotationHistoryKey = 'cooper_key_rotation_history';
    }

    // キーローテーションが必要かチェック
    async checkRotationRequired(userId) {
        const lastRotation = localStorage.getItem(`${this.lastRotationKey}_${userId}`);
        
        if (!lastRotation) {
            // 初回は現在日時を記録
            this.updateLastRotationDate(userId);
            return false;
        }

        const lastRotationDate = new Date(lastRotation);
        const currentDate = new Date();
        const daysSinceRotation = Math.floor((currentDate - lastRotationDate) / (1000 * 60 * 60 * 24));

        return daysSinceRotation >= this.rotationInterval;
    }

    // キーローテーションの実行
    async performKeyRotation(userId) {
        try {
            // 確認ダイアログ
            const confirmed = confirm(
                `セキュリティ強化のため、暗号化キーの更新を推奨します。\n` +
                `最後の更新から${this.rotationInterval}日以上経過しています。\n\n` +
                `キーを更新しますか？（処理には時間がかかる場合があります）`
            );

            if (!confirmed) {
                // スキップした日時を記録
                this.recordRotationSkipped(userId);
                return false;
            }

            // プログレス表示
            const progressUI = this.createProgressUI();
            document.body.appendChild(progressUI);

            // 新しいキーを生成
            const newKey = await this.generateNewKey(userId);
            const oldKey = keyManager.getKey();

            // すべてのデータを再暗号化
            await this.reencryptAllData(userId, oldKey, newKey);

            // キーを更新
            await this.updateStoredKey(userId, newKey);

            // ローテーション完了を記録
            this.updateLastRotationDate(userId);
            this.recordRotationHistory(userId);

            // プログレス表示を削除
            document.body.removeChild(progressUI);

            alert('暗号化キーの更新が完了しました。');
            return true;

        } catch (error) {
            console.error('キーローテーションエラー:', error);
            alert('キーの更新中にエラーが発生しました。');
            return false;
        }
    }

    // 新しいキーを生成
    async generateNewKey(userId) {
        // 新しいソルトを生成
        const newSalt = cryptoUtils.generateSalt();
        const saltBase64 = cryptoUtils.arrayBufferToBase64(newSalt);
        
        // 新しいキーを導出
        const password = userId + '_cooper_' + new Date().getTime();
        const newKey = await cryptoUtils.deriveKeyFromPassword(password, newSalt);

        // 新しいソルトを保存（まだコミットしない）
        sessionStorage.setItem(`new_salt_${userId}`, saltBase64);

        return newKey;
    }

    // すべてのデータを再暗号化
    async reencryptAllData(userId, oldKey, newKey) {
        const contactsRef = getUserCollection(userId);
        const snapshot = await contactsRef.get();
        const total = snapshot.size;
        let processed = 0;

        // バッチ処理
        const batch = db.batch();

        for (const doc of snapshot.docs) {
            let contact = doc.data();

            // 古いキーで復号化
            if (contact._encrypted) {
                contact = await cryptoUtils.decryptSensitiveFields(contact, oldKey);
            }

            // 新しいキーで暗号化
            const reencryptedContact = await cryptoUtils.encryptSensitiveFields(contact, newKey);

            // バッチ更新
            batch.update(doc.ref, {
                ...reencryptedContact,
                _lastKeyRotation: new Date().toISOString()
            });

            processed++;

            // プログレス更新
            this.updateProgress(processed, total);

            // UIの更新を反映
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // バッチコミット
        await batch.commit();
    }

    // 保存されているキーを更新
    async updateStoredKey(userId, newKey) {
        // 新しいソルトを正式に保存
        const newSalt = sessionStorage.getItem(`new_salt_${userId}`);
        localStorage.setItem(`salt_${userId}`, newSalt);
        sessionStorage.removeItem(`new_salt_${userId}`);

        // キーマネージャーを更新
        keyManager.encryptionKey = newKey;
    }

    // プログレスUIを作成
    createProgressUI() {
        const progressDiv = document.createElement('div');
        progressDiv.id = 'keyRotationProgress';
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 300px;
        `;
        progressDiv.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">🔐 暗号化キーを更新しています</h3>
            <p style="color: #666;">セキュリティ強化のため、データを再暗号化しています...</p>
            <div style="margin: 20px 0;">
                <div style="background: #f0f0f0; border-radius: 10px; height: 24px; overflow: hidden;">
                    <div id="rotationProgressBar" style="width: 0%; height: 100%; background: #1D9BF0; transition: width 0.3s; display: flex; align-items: center; justify-content: center;">
                        <span id="rotationProgressText" style="color: white; font-weight: bold; font-size: 12px;">0%</span>
                    </div>
                </div>
            </div>
            <p style="color: #999; font-size: 12px; margin-bottom: 0;">処理中はブラウザを閉じないでください</p>
        `;
        return progressDiv;
    }

    // プログレスを更新
    updateProgress(current, total) {
        const percentage = Math.round((current / total) * 100);
        const progressBar = document.getElementById('rotationProgressBar');
        const progressText = document.getElementById('rotationProgressText');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    }

    // 最終ローテーション日時を更新
    updateLastRotationDate(userId) {
        localStorage.setItem(`${this.lastRotationKey}_${userId}`, new Date().toISOString());
    }

    // ローテーションをスキップした記録
    recordRotationSkipped(userId) {
        const skipKey = `${this.rotationCheckKey}_skipped_${userId}`;
        const skipCount = parseInt(localStorage.getItem(skipKey) || '0') + 1;
        localStorage.setItem(skipKey, skipCount.toString());

        // 3回スキップしたら次回は強く推奨
        if (skipCount >= 3) {
            localStorage.setItem(`${this.rotationCheckKey}_force_${userId}`, 'true');
        }
    }

    // ローテーション履歴を記録
    recordRotationHistory(userId) {
        const historyKey = `${this.rotationHistoryKey}_${userId}`;
        const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        
        history.push({
            date: new Date().toISOString(),
            userId: userId,
            method: 'automatic'
        });

        // 最新10件のみ保持
        if (history.length > 10) {
            history.shift();
        }

        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    // 手動キーローテーション
    async manualKeyRotation(userId) {
        const confirmed = confirm(
            '手動で暗号化キーを更新します。\n' +
            'この操作により、すべてのデータが新しいキーで再暗号化されます。\n\n' +
            '続行しますか？'
        );

        if (confirmed) {
            await this.performKeyRotation(userId);
        }
    }

    // ローテーション設定の取得
    getRotationSettings(userId) {
        return {
            interval: this.rotationInterval,
            lastRotation: localStorage.getItem(`${this.lastRotationKey}_${userId}`),
            skipCount: parseInt(localStorage.getItem(`${this.rotationCheckKey}_skipped_${userId}`) || '0'),
            history: JSON.parse(localStorage.getItem(`${this.rotationHistoryKey}_${userId}`) || '[]')
        };
    }

    // ローテーション間隔の設定
    setRotationInterval(days) {
        if (days >= 30 && days <= 365) {
            this.rotationInterval = days;
            localStorage.setItem('cooper_rotation_interval', days.toString());
        }
    }
}

// インスタンスを作成
const keyRotationManager = new KeyRotationManager();

// 起動時のチェック関数
async function checkKeyRotationOnStartup(userId) {
    try {
        // 設定された間隔を読み込み
        const savedInterval = localStorage.getItem('cooper_rotation_interval');
        if (savedInterval) {
            keyRotationManager.setRotationInterval(parseInt(savedInterval));
        }

        // ローテーションが必要かチェック
        if (await keyRotationManager.checkRotationRequired(userId)) {
            // 強制フラグをチェック
            const forceRotation = localStorage.getItem(`cooper_key_rotation_check_force_${userId}`) === 'true';
            
            if (forceRotation) {
                alert(
                    '⚠️ セキュリティ警告\n\n' +
                    '暗号化キーの更新を複数回スキップしています。\n' +
                    'セキュリティ強化のため、強く更新を推奨します。'
                );
            }

            // ローテーションを実行
            const rotated = await keyRotationManager.performKeyRotation(userId);
            
            if (rotated && forceRotation) {
                // 強制フラグをリセット
                localStorage.removeItem(`cooper_key_rotation_check_force_${userId}`);
                localStorage.removeItem(`cooper_key_rotation_check_skipped_${userId}`);
            }
        }
    } catch (error) {
        console.error('キーローテーションチェックエラー:', error);
    }
}