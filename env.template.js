// 環境変数テンプレート
// このファイルをコピーして env.js として保存し、実際の値を設定してください
// env.js は .gitignore に追加されているため、Gitにコミットされません

window.ENV = {
    FIREBASE_CONFIG: {
        apiKey: "YOUR_API_KEY_HERE",
        authDomain: "YOUR_AUTH_DOMAIN_HERE",
        projectId: "YOUR_PROJECT_ID_HERE",
        storageBucket: "YOUR_STORAGE_BUCKET_HERE",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
        appId: "YOUR_APP_ID_HERE",
        measurementId: "YOUR_MEASUREMENT_ID_HERE"
    }
};

// 使用方法:
// 1. このファイルをコピーして env.js として保存
// 2. 上記の YOUR_*_HERE の部分を実際のFirebase設定値に置き換え
// 3. index.html の firebase-config.js より前に env.js を読み込むように設定