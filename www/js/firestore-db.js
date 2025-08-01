// Firestoreデータベース操作 - CDN版を使用

// ユーザーのデータコレクションを取得
function getUserCollection(userId) {
    return db.collection('users').doc(userId).collection('contacts');
}

// 連絡先を保存
async function saveContact(userId, contact) {
    try {
        const contactsRef = getUserCollection(userId);
        await contactsRef.doc(contact.id).set({
            ...contact,
            updatedAt: new Date().toISOString()
        });
        console.log('連絡先を保存しました:', contact.id);
    } catch (error) {
        console.error('連絡先の保存エラー:', error);
        throw error;
    }
}

// すべての連絡先を取得
async function getAllContacts(userId) {
    try {
        const contactsRef = getUserCollection(userId);
        const querySnapshot = await contactsRef.orderBy('updatedAt', 'desc').get();
        
        const contacts = [];
        querySnapshot.forEach((doc) => {
            contacts.push(doc.data());
        });
        
        return contacts;
    } catch (error) {
        console.error('連絡先の取得エラー:', error);
        throw error;
    }
}

// 特定の連絡先を取得
async function getContact(userId, contactId) {
    try {
        const contactsRef = getUserCollection(userId);
        const docSnap = await contactsRef.doc(contactId).get();
        
        if (docSnap.exists) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('連絡先の取得エラー:', error);
        throw error;
    }
}

// 連絡先を更新
async function updateContact(userId, contact) {
    try {
        const contactsRef = getUserCollection(userId);
        await contactsRef.doc(contact.id).update({
            ...contact,
            updatedAt: new Date().toISOString()
        });
        console.log('連絡先を更新しました:', contact.id);
    } catch (error) {
        console.error('連絡先の更新エラー:', error);
        throw error;
    }
}

// 連絡先を削除
async function deleteContact(userId, contactId) {
    try {
        const contactsRef = getUserCollection(userId);
        await contactsRef.doc(contactId).delete();
        console.log('連絡先を削除しました:', contactId);
    } catch (error) {
        console.error('連絡先の削除エラー:', error);
        throw error;
    }
}

// すべての連絡先を削除
async function deleteAllContacts(userId) {
    try {
        const contactsRef = getUserCollection(userId);
        const querySnapshot = await contactsRef.get();
        
        // バッチ削除を使用して効率的に削除
        const batch = db.batch();
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log(`${querySnapshot.size}件の連絡先を削除しました`);
    } catch (error) {
        console.error('すべての連絡先の削除エラー:', error);
        throw error;
    }
}

// ローカルストレージからFirestoreへデータを移行
async function migrateFromLocalStorage(userId) {
    try {
        const localData = localStorage.getItem('contactsData');
        if (!localData) {
            console.log('移行するデータがありません');
            return;
        }

        const contacts = JSON.parse(localData);
        console.log(`${contacts.length}件の連絡先を移行します`);

        for (const contact of contacts) {
            await saveContact(userId, contact);
        }

        // 移行成功後、ローカルストレージをクリア
        localStorage.removeItem('contactsData');
        console.log('データ移行が完了しました');
    } catch (error) {
        console.error('データ移行エラー:', error);
        throw error;
    }
}