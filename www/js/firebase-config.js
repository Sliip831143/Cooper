// Firebase設定 - CDN版を使用

// Firebaseプロジェクトの設定
const firebaseConfig = {
    apiKey: "AIzaSyBNoKqLP8faM6nE9ZgmLxwqU199kFM_Gsg",
    authDomain: "coop-keeper.firebaseapp.com",
    projectId: "coop-keeper",
    storageBucket: "coop-keeper.firebasestorage.app",
    messagingSenderId: "674829099817",
    appId: "1:674829099817:web:623cd17fc86d28c1ad0d38",
    measurementId: "G-PBV2MCCVK0"
};

// Firebaseの初期化
const app = firebase.initializeApp(firebaseConfig);

// 認証とFirestoreのインスタンスを取得
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();