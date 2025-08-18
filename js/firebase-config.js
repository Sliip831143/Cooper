// Firebase設定 - CDN版を使用

// 環境変数からFirebase設定を取得する関数
function getFirebaseConfig() {
    // 環境変数が設定されているかチェック
    if (typeof window.ENV !== 'undefined' && window.ENV.FIREBASE_CONFIG) {
        return window.ENV.FIREBASE_CONFIG;
    }
    
    // 環境変数が設定されていない場合はエラーを表示
    console.error('Firebase設定が見つかりません。env.jsファイルを作成して設定してください。');
    
    // 開発環境向けの警告メッセージ
    const errorMessage = `
        <div style="padding: 20px; background: #ff6b6b; color: white; margin: 20px; border-radius: 8px;">
            <h2>⚠️ Firebase設定エラー</h2>
            <p>Firebase設定が見つかりません。以下の手順で設定してください：</p>
            <ol>
                <li>プロジェクトルートに <code>env.js</code> ファイルを作成</li>
                <li><code>env.template.js</code> の内容をコピーして、実際の値を設定</li>
                <li>ページをリロード</li>
            </ol>
            <p>詳細は <code>SETUP_GUIDE.md</code> を参照してください。</p>
        </div>
    `;
    
    document.body.innerHTML = errorMessage;
    throw new Error('Firebase設定が見つかりません');
}

// Firebaseプロジェクトの設定を取得
const firebaseConfig = getFirebaseConfig();

// Firebaseの初期化
const app = firebase.initializeApp(firebaseConfig);

// 認証とFirestoreのインスタンスを取得
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();