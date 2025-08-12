// Web Crypto APIを使用した暗号化ユーティリティ
// 個人情報を保護するためのクライアントサイド暗号化

class CryptoUtils {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
        this.saltLength = 16;
        this.ivLength = 12;
        this.tagLength = 128;
        this.iterations = 100000;
    }

    // ユーザーのパスワードから暗号化キーを導出
    async deriveKeyFromPassword(password, salt) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        
        // パスワードをインポート
        const passwordKey = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            'PBKDF2',
            false,
            ['deriveKey']
        );
        
        // PBKDF2でキーを導出
        return await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: this.iterations,
                hash: 'SHA-256'
            },
            passwordKey,
            {
                name: this.algorithm,
                length: this.keyLength
            },
            false,
            ['encrypt', 'decrypt']
        );
    }

    // ランダムなソルトを生成
    generateSalt() {
        return crypto.getRandomValues(new Uint8Array(this.saltLength));
    }

    // ランダムなIVを生成
    generateIV() {
        return crypto.getRandomValues(new Uint8Array(this.ivLength));
    }

    // テキストを暗号化
    async encryptText(text, key) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const iv = this.generateIV();
        
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: this.algorithm,
                iv: iv,
                tagLength: this.tagLength
            },
            key,
            data
        );
        
        // IVと暗号化データを結合
        const combined = new Uint8Array(iv.length + encryptedData.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encryptedData), iv.length);
        
        // Base64エンコード
        return this.arrayBufferToBase64(combined);
    }

    // テキストを復号化
    async decryptText(encryptedBase64, key) {
        // Base64デコード
        const combined = this.base64ToArrayBuffer(encryptedBase64);
        
        // IVと暗号化データを分離
        const iv = combined.slice(0, this.ivLength);
        const encryptedData = combined.slice(this.ivLength);
        
        const decryptedData = await crypto.subtle.decrypt(
            {
                name: this.algorithm,
                iv: iv,
                tagLength: this.tagLength
            },
            key,
            encryptedData
        );
        
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    }

    // 機密フィールドの選択的暗号化
    async encryptSensitiveFields(personData, key) {
        const encryptedData = { ...personData };
        
        // 暗号化すべきフィールドのリスト
        const sensitiveFields = [
            'phone',
            'email',
            'line',
            'twitter',
            'instagram',
            'facebook',
            'sns',
            'residence',
            'notes',
            'features'  // 顔の特徴も機密情報として扱う
        ];
        
        for (const field of sensitiveFields) {
            if (encryptedData[field]) {
                try {
                    encryptedData[field] = await this.encryptText(encryptedData[field], key);
                } catch (error) {
                    console.error(`Failed to encrypt field ${field}:`, error);
                }
            }
        }
        
        // 暗号化フラグを追加
        encryptedData._encrypted = true;
        encryptedData._encryptedFields = sensitiveFields;
        
        return encryptedData;
    }

    // 機密フィールドの選択的復号化
    async decryptSensitiveFields(encryptedData, key) {
        if (!encryptedData._encrypted) {
            return encryptedData;
        }
        
        const decryptedData = { ...encryptedData };
        const fieldsToDecrypt = encryptedData._encryptedFields || [];
        
        for (const field of fieldsToDecrypt) {
            if (decryptedData[field]) {
                try {
                    decryptedData[field] = await this.decryptText(decryptedData[field], key);
                } catch (error) {
                    console.error(`Failed to decrypt field ${field}:`, error);
                    decryptedData[field] = ''; // 復号化に失敗した場合は空文字に
                }
            }
        }
        
        // 暗号化フラグを削除
        delete decryptedData._encrypted;
        delete decryptedData._encryptedFields;
        
        return decryptedData;
    }

    // ArrayBufferをBase64に変換
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // Base64をArrayBufferに変換
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    // キーのエクスポート（保存用）
    async exportKey(key) {
        const exported = await crypto.subtle.exportKey('raw', key);
        return this.arrayBufferToBase64(exported);
    }

    // キーのインポート（復元用）
    async importKey(keyBase64) {
        const keyBuffer = this.base64ToArrayBuffer(keyBase64);
        return await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            {
                name: this.algorithm,
                length: this.keyLength
            },
            false,
            ['encrypt', 'decrypt']
        );
    }
}

// localStorage用の暗号化ヘルパー
class SecureStorage {
    constructor() {
        this.crypto = new CryptoUtils();
        this.keyName = 'cooper_enc_key';
        this.saltName = 'cooper_enc_salt';
    }

    // 暗号化キーの初期化または取得
    async initializeKey() {
        let key = sessionStorage.getItem(this.keyName);
        let salt = localStorage.getItem(this.saltName);
        
        if (!key || !salt) {
            // 新しいキーを生成
            const password = await this.requestMasterPassword();
            if (!password) return null;
            
            salt = this.crypto.generateSalt();
            localStorage.setItem(this.saltName, this.crypto.arrayBufferToBase64(salt));
            
            const derivedKey = await this.crypto.deriveKeyFromPassword(password, salt);
            const exportedKey = await this.crypto.exportKey(derivedKey);
            sessionStorage.setItem(this.keyName, exportedKey);
            
            return derivedKey;
        } else {
            // 既存のキーを使用
            return await this.crypto.importKey(key);
        }
    }

    // マスターパスワードの入力を要求
    async requestMasterPassword() {
        const password = prompt('データを暗号化するためのパスワードを入力してください。\nこのパスワードは忘れないようにしてください。');
        if (!password || password.length < 8) {
            alert('パスワードは8文字以上で入力してください。');
            return null;
        }
        return password;
    }

    // 暗号化してlocalStorageに保存
    async setItem(key, data) {
        const encKey = await this.initializeKey();
        if (!encKey) return false;
        
        try {
            const jsonString = JSON.stringify(data);
            const encrypted = await this.crypto.encryptText(jsonString, encKey);
            localStorage.setItem(key, encrypted);
            return true;
        } catch (error) {
            console.error('Encryption failed:', error);
            return false;
        }
    }

    // localStorageから復号化して取得
    async getItem(key) {
        const encKey = await this.initializeKey();
        if (!encKey) return null;
        
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            
            const decrypted = await this.crypto.decryptText(encrypted, encKey);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }
}

// エクスポート
const cryptoUtils = new CryptoUtils();
const secureStorage = new SecureStorage();