// Firestoreデータベース操作 - 暗号化対応版

// crypto-utils.jsで定義された暗号化ユーティリティを使用
// ※実際の使用時は、index.htmlでcrypto-utils.jsを先に読み込む必要があります

// 暗号化キーの管理
class EncryptionKeyManager {
    constructor() {
        this.keyName = 'cooper_user_key';
        this.initialized = false;
    }

    // ユーザーごとの暗号化キーを初期化
    async initializeUserKey(userId) {
        if (this.initialized) return;
        
        // ユーザーIDをベースにした暗号化キーを生成
        const salt = await this.getOrCreateUserSalt(userId);
        const password = userId + '_cooper_2025'; // ユーザーIDベースの固定パスワード
        
        this.encryptionKey = await cryptoUtils.deriveKeyFromPassword(password, salt);
        this.initialized = true;
    }

    // ユーザーごとのソルトを取得または作成
    async getOrCreateUserSalt(userId) {
        const saltKey = `salt_${userId}`;
        let saltBase64 = localStorage.getItem(saltKey);
        
        if (!saltBase64) {
            const salt = cryptoUtils.generateSalt();
            saltBase64 = cryptoUtils.arrayBufferToBase64(salt);
            localStorage.setItem(saltKey, saltBase64);
        }
        
        return cryptoUtils.base64ToArrayBuffer(saltBase64);
    }

    getKey() {
        return this.encryptionKey;
    }
}

const keyManager = new EncryptionKeyManager();

// 誕生日から年齢を計算する関数（元の関数と同じ）
function calculateAgeFromBirthday(birthday) {
    if (!birthday) return '';
    
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
        
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            age--;
        }
        
        return age.toString();
    }
    
    return '';
}

// ユーザーのデータコレクションを取得
function getUserCollection(userId) {
    return db.collection('users').doc(userId).collection('contacts');
}

// 連絡先を保存（暗号化対応）
async function saveContactSecure(userId, contact) {
    try {
        // 暗号化キーを初期化
        await keyManager.initializeUserKey(userId);
        const key = keyManager.getKey();
        
        // 機密フィールドを暗号化
        const encryptedContact = await cryptoUtils.encryptSensitiveFields(contact, key);
        
        const contactsRef = getUserCollection(userId);
        await contactsRef.doc(contact.id).set({
            ...encryptedContact,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('連絡先の保存エラー:', error);
        throw error;
    }
}

// すべての連絡先を取得（復号化対応）
async function getAllContactsSecure(userId) {
    try {
        // 暗号化キーを初期化
        await keyManager.initializeUserKey(userId);
        const key = keyManager.getKey();
        
        const contactsRef = getUserCollection(userId);
        const querySnapshot = await contactsRef.orderBy('updatedAt', 'desc').get();
        
        const contacts = [];
        for (const doc of querySnapshot.docs) {
            let contact = doc.data();
            
            // 暗号化されたデータの場合は復号化
            if (contact._encrypted) {
                contact = await cryptoUtils.decryptSensitiveFields(contact, key);
            }
            
            // 誕生日から年齢を自動計算
            if (contact.birthday) {
                const calculatedAge = calculateAgeFromBirthday(contact.birthday);
                if (calculatedAge) {
                    contact.age = calculatedAge;
                }
            }
            
            contacts.push(contact);
        }
        
        return contacts;
    } catch (error) {
        console.error('連絡先の取得エラー:', error);
        throw error;
    }
}

// 特定の連絡先を取得（復号化対応）
async function getContactSecure(userId, contactId) {
    try {
        // 暗号化キーを初期化
        await keyManager.initializeUserKey(userId);
        const key = keyManager.getKey();
        
        const contactsRef = getUserCollection(userId);
        const docSnap = await contactsRef.doc(contactId).get();
        
        if (docSnap.exists) {
            let contact = docSnap.data();
            
            // 暗号化されたデータの場合は復号化
            if (contact._encrypted) {
                contact = await cryptoUtils.decryptSensitiveFields(contact, key);
            }
            
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

// 連絡先を更新（暗号化対応）
async function updateContactSecure(userId, contact) {
    try {
        // 暗号化キーを初期化
        await keyManager.initializeUserKey(userId);
        const key = keyManager.getKey();
        
        // 機密フィールドを暗号化
        const encryptedContact = await cryptoUtils.encryptSensitiveFields(contact, key);
        
        const contactsRef = getUserCollection(userId);
        await contactsRef.doc(contact.id).update({
            ...encryptedContact,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('連絡先の更新エラー:', error);
        throw error;
    }
}

// 既存の関数名との互換性のため、エイリアスを作成
const saveContact = saveContactSecure;
const getAllContacts = getAllContactsSecure;
const getContact = getContactSecure;
const updateContact = updateContactSecure;

// 連絡先を削除（暗号化対応版）
async function deleteContactSecure(userId, contactId) {
    try {
        const contactsRef = getUserCollection(userId);
        await contactsRef.doc(contactId).delete();
    } catch (error) {
        console.error('連絡先の削除エラー:', error);
        throw error;
    }
}

// すべての連絡先を削除（暗号化対応版）
async function deleteAllContactsSecure(userId) {
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

// 削除関数のエイリアス
const deleteContact = deleteContactSecure;
const deleteAllContacts = deleteAllContactsSecure;