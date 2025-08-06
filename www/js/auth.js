// Firebase認証機能 - CDN版を使用

// 現在のユーザー情報を保持
let currentUser = null;

// Google認証でサインイン
async function signInWithGoogle() {
    try {
        // プロンプトを表示して、アカウント選択を強制
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
        
        // Capacitorアプリ内での実行を検出
        const isCapacitorApp = window.Capacitor && window.Capacitor.isNativePlatform();
        
        if (isCapacitorApp) {
            // アプリ内ではリダイレクトを使用
            await auth.signInWithRedirect(googleProvider);
            // リダイレクト後の処理は getRedirectResult で行う
        } else {
            // ブラウザではポップアップを使用
            const result = await auth.signInWithPopup(googleProvider);
            currentUser = result.user;
            return currentUser;
        }
    } catch (error) {
        console.error('サインインエラー:', error);
        throw error;
    }
}

// サインアウト
async function signOutUser() {
    try {
        await auth.signOut();
        currentUser = null;
    } catch (error) {
        console.error('サインアウトエラー:', error);
        throw error;
    }
}

// 現在のユーザーを取得
function getCurrentUser() {
    return currentUser;
}

// 認証状態の変更を監視
function initializeAuth(callback) {
    // リダイレクト結果を確認
    auth.getRedirectResult().then((result) => {
        if (result.user) {
            currentUser = result.user;
        }
    }).catch((error) => {
        console.error('リダイレクトエラー:', error);
    });
    
    return auth.onAuthStateChanged((user) => {
        currentUser = user;
        callback(user);
    });
}

// ユーザーがサインインしているかチェック
function isUserSignedIn() {
    return currentUser !== null;
}