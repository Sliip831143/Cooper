// データストレージの抽象化レイヤー
// ローカルストレージとFirestoreの両方に対応

import { getCurrentUser } from './auth.js';
import * as firestoreDB from './firestore-db.js';

// 現在の保存先を管理
let useFirestore = false;

// 初期化
export function initializeStorage(user) {
    useFirestore = !!user;
}

// 連絡先を保存
export async function saveContact(contact) {
    if (useFirestore && getCurrentUser()) {
        return await firestoreDB.saveContact(getCurrentUser().uid, contact);
    } else {
        // ローカルストレージに保存
        const persons = getLocalContacts();
        const index = persons.findIndex(p => p.id === contact.id);
        if (index !== -1) {
            persons[index] = contact;
        } else {
            persons.push(contact);
        }
        localStorage.setItem('persons', JSON.stringify(persons));
    }
}

// すべての連絡先を取得
export async function getAllContacts() {
    if (useFirestore && getCurrentUser()) {
        return await firestoreDB.getAllContacts(getCurrentUser().uid);
    } else {
        return getLocalContacts();
    }
}

// 連絡先を削除
export async function deleteContact(contactId) {
    if (useFirestore && getCurrentUser()) {
        return await firestoreDB.deleteContact(getCurrentUser().uid, contactId);
    } else {
        const persons = getLocalContacts();
        const filtered = persons.filter(p => p.id !== contactId);
        localStorage.setItem('persons', JSON.stringify(filtered));
    }
}

// すべての連絡先を削除
export async function deleteAllContacts() {
    if (useFirestore && getCurrentUser()) {
        return await firestoreDB.deleteAllContacts(getCurrentUser().uid);
    } else {
        localStorage.removeItem('persons');
    }
}

// ローカルストレージから連絡先を取得
function getLocalContacts() {
    return JSON.parse(localStorage.getItem('persons') || '[]');
}