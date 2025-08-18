// データストレージの抽象化レイヤー - 暗号化対応版
// ローカルストレージとFirestoreの両方に対応

import { getCurrentUser } from './auth.js';
import * as firestoreDB from './secure-firestore-db.js';

// 現在の保存先を管理
let useFirestore = false;

// 初期化
export function initializeStorage(user) {
    useFirestore = !!user;
}

// 連絡先を保存（暗号化対応）
export async function saveContact(contact) {
    if (useFirestore && getCurrentUser()) {
        return await firestoreDB.saveContact(getCurrentUser().uid, contact);
    } else {
        // ローカルストレージに暗号化して保存
        const persons = await getLocalContacts();
        const index = persons.findIndex(p => p.id === contact.id);
        if (index !== -1) {
            persons[index] = contact;
        } else {
            persons.push(contact);
        }
        
        // SecureStorageを使用して暗号化保存
        await secureStorage.setItem('persons', persons);
    }
}

// すべての連絡先を取得（復号化対応）
export async function getAllContacts() {
    if (useFirestore && getCurrentUser()) {
        return await firestoreDB.getAllContacts(getCurrentUser().uid);
    } else {
        return await getLocalContacts();
    }
}

// 連絡先を削除
export async function deleteContact(contactId) {
    if (useFirestore && getCurrentUser()) {
        return await firestoreDB.deleteContact(getCurrentUser().uid, contactId);
    } else {
        const persons = await getLocalContacts();
        const filtered = persons.filter(p => p.id !== contactId);
        await secureStorage.setItem('persons', filtered);
    }
}

// すべての連絡先を削除
export async function deleteAllContacts() {
    if (useFirestore && getCurrentUser()) {
        return await firestoreDB.deleteAllContacts(getCurrentUser().uid);
    } else {
        localStorage.removeItem('persons');
        // 暗号化キーも削除
        localStorage.removeItem('cooper_enc_salt');
        sessionStorage.removeItem('cooper_enc_key');
    }
}

// ローカルストレージから連絡先を取得（暗号化対応）
async function getLocalContacts() {
    try {
        // まず暗号化されたデータを試す
        const encryptedContacts = await secureStorage.getItem('persons');
        if (encryptedContacts) {
            return encryptedContacts;
        }
        
        // 暗号化されていない古いデータがある場合
        const oldData = localStorage.getItem('persons');
        if (oldData) {
            const persons = JSON.parse(oldData);
            // 暗号化して保存し直す
            await secureStorage.setItem('persons', persons);
            // 古いデータを削除
            localStorage.removeItem('persons');
            return persons;
        }
        
        return [];
    } catch (error) {
        console.error('ローカルストレージの読み込みエラー:', error);
        // エラーの場合は古いデータを試す
        const oldData = localStorage.getItem('persons');
        return oldData ? JSON.parse(oldData) : [];
    }
}