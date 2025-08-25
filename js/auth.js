// Firebase認証機能 - CDN版を使用

// 現在のユーザー情報を保持
let currentUser = null;

// Google認証でサインイン
async function signInWithGoogle() {
    try {
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
        
        // モバイルデバイスの検出
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // モバイルではリダイレクトを使用
            await auth.signInWithRedirect(googleProvider);
            // リダイレクト後は自動的にgetRedirectResultで処理される
            return null;
        } else {
            // デスクトップではポップアップを使用
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
            
            // アカウント切り替え処理中かチェック
            const isAccountSwitching = sessionStorage.getItem('isAccountSwitching') === 'true';
            const previousUserEmail = sessionStorage.getItem('previousUserEmail');
            
            if (isAccountSwitching && previousUserEmail && result.user.email !== previousUserEmail) {
                // 異なるアカウントでログインした場合の処理
                // この処理はindex.htmlのonAuthStateChangedで行われる
                sessionStorage.removeItem('isAccountSwitching');
                sessionStorage.removeItem('previousUserEmail');
            }
        }
    }).catch((error) => {
        // sessionStorageエラーを回避
        if (error.code === 'auth/missing-or-invalid-nonce') {
            console.log('リダイレクト認証を再試行してください');
        } else {
            console.error('リダイレクトエラー:', error);
        }
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