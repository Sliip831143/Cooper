// Firestoreデータベース操作 - CDN版を使用

// 誕生日から年齢を計算する関数
function calculateAgeFromBirthday(birthday) {
    if (!birthday) return '';
    
    // yyyy/mm/dd形式の完全な日付をチェック
    const fullDateMatch = birthday.match(/(\d{4})[年\/](\d{1,2})[月\/](\d{1,2})/);
    if (fullDateMatch) {
        const birthYear = parseInt(fullDateMatch[1]);
        const birthMonth = parseInt(fullDateMatch[2]);
        const birthDay = parseInt(fullDateMatch[3]);
        
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();
        
        let age = currentYear - birthYear;
        
        // 誕生日が今年まだ来ていない場合は1歳引く
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            age--;
        }
        
        return age.toString();
    }
    
    // 月日のみの場合は年齢を計算できない
    return '';
}

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
            const contact = doc.data();
            // 誕生日から年齢を自動計算
            if (contact.birthday) {
                const calculatedAge = calculateAgeFromBirthday(contact.birthday);
                if (calculatedAge) {
                    contact.age = calculatedAge;
                }
            }
            contacts.push(contact);
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
            const contact = docSnap.data();
            // 誕生日から年齢を自動計算
            if (contact.birthday) {
                const calculatedAge = calculateAgeFromBirthday(contact.birthday);
                if (calculatedAge) {
                    contact.age = calculatedAge;
                }
            }
            return contact;
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
            return;
        }

        const contacts = JSON.parse(localData);

        for (const contact of contacts) {
            await saveContact(userId, contact);
        }

        // 移行成功後、ローカルストレージをクリア
        localStorage.removeItem('contactsData');
    } catch (error) {
        console.error('データ移行エラー:', error);
        throw error;
    }
}