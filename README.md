# Cooper - 人物情報管理PWAアプリ

## 概要
Cooperは、出会った人の情報を記録・管理するためのProgressive Web App (PWA)です。Firebase AuthenticationとFirestoreを使用し、Googleアカウントでサインインして個人データを安全に管理できます。

## アプリケーションURL
- **本番環境**: https://coop-keeper.web.app
- **代替URL**: https://coop-keeper.firebaseapp.com

## 技術スタック

### フロントエンド
- **HTML5/CSS3/JavaScript** (Vanilla JS)
- **Material Design 3** - UIデザインシステム
- **Google Fonts** - Bree Serif（ロゴフォント）
- **Progressive Web App (PWA)** - オフライン対応、インストール可能

### バックエンド・インフラ
- **Firebase Authentication** - Google認証
- **Firebase Firestore** - NoSQLデータベース
- **Firebase Hosting** - ホスティングサービス
- **Service Worker** - オフライン機能とキャッシング

## ディレクトリ構成

```
Cooper/
├── index.html              # メインHTMLファイル（アプリケーション全体）
├── manifest.json           # PWA設定ファイル
├── sw.js                   # Service Worker（オフライン対応）
├── firebase.json           # Firebase Hosting設定
├── .firebaserc            # Firebaseプロジェクト設定
├── .gitignore             # Git除外設定
├── DEPLOY.md              # デプロイ手順書
├── README.md              # このファイル
│
├── js/                    # JavaScriptファイル
│   ├── firebase-config.js # Firebase初期化設定
│   ├── auth.js           # 認証機能
│   ├── firestore-db.js   # Firestore操作
│   ├── data-storage.js   # ローカルストレージ操作
│   └── image-utils.js    # 画像処理ユーティリティ
│
└── icons/                 # PWAアイコン
    ├── icon-192x192.png  # PWAアイコン（192x192）
    └── icon-512x512.png  # PWAアイコン（512x512）
```

## 主要ファイルの説明

### `index.html`
- アプリケーション全体を含む単一ページアプリケーション
- Material Design 3のスタイリング
- 人物情報の登録・編集・削除機能のUI

### `js/firebase-config.js`
- Firebaseプロジェクトの設定
- Firebase SDKの初期化

### `js/auth.js`
- Google認証の実装
- サインイン/サインアウト機能
- ユーザー状態管理

### `js/firestore-db.js`
- Firestoreとのデータ同期
- CRUD操作（作成・読取・更新・削除）
- リアルタイムデータ同期

### `js/data-storage.js`
- ローカルストレージへのデータ保存
- オフライン時のフォールバック

### `js/image-utils.js`
- 画像の圧縮処理
- 画像のBase64エンコード
- サイズ最適化

### `sw.js`
- Service Workerによるキャッシング戦略
- オフライン時の基本機能提供

### `manifest.json`
- PWA設定（名前、アイコン、テーマカラー等）
- スタンドアロンモードの設定

## 機能一覧

- ✅ Googleアカウントでのサインイン/サインアウト
- ✅ 個人情報の記録（名前、年齢、誕生日、出会った場所、趣味など）
- ✅ 写真のアップロード・圧縮
- ✅ データの検索・ソート機能
- ✅ データのエクスポート/インポート
- ✅ ダークモード対応
- ✅ モバイル対応レスポンシブデザイン
- ✅ PWAとしてインストール可能
- ✅ オフライン対応
- ✅ 誕生日からの年齢自動計算
- ✅ 電話番号・LINE連携機能
- ✅ SNSアカウント連携（Twitter/Instagram/Facebook）
- ✅ Googleカレンダー誕生日連携
- ✅ ピン留め機能

## セットアップ手順

### 前提条件
- Node.js (npm)
- Firebaseプロジェクト
- Googleアカウント

### 1. Firebase CLIのインストール
```bash
npm install -g firebase-tools
```

### 2. Firebaseにログイン
```bash
firebase login
```

### 3. 依存関係の確認
特別な依存関係はありません。すべてCDNから読み込まれます。

## 開発・ビルド手順

### ローカル開発サーバーの起動

#### Python 3の場合
```bash
python -m http.server 8000
```

#### Python 2.7の場合
```bash
python -m SimpleHTTPServer 8000
```

#### Node.jsの場合
```bash
npx serve
```

#### Firebase CLIの場合
```bash
firebase serve --only hosting
```

ブラウザで `http://localhost:8000` にアクセス

### ファイル更新時の手順

1. **コード変更**
   - 必要なファイルを編集
   - ローカルでテスト

2. **Firebase Hostingへのデプロイ**
   ```bash
   firebase deploy --only hosting
   ```
   
   または npx を使用:
   ```bash
   npx firebase-tools deploy --only hosting
   ```

3. **デプロイ確認**
   - https://coop-keeper.web.app にアクセス
   - 変更が反映されていることを確認

## Firebase設定

### Authentication設定
1. Firebase Consoleで「Authentication」を開く
2. 「Sign-in method」でGoogleを有効化
3. 「Authorized domains」に以下を追加：
   - `localhost`
   - `coop-keeper.web.app`
   - `coop-keeper.firebaseapp.com`

### Firestore設定
1. Firebase Consoleで「Firestore Database」を開く
2. データベースを作成（本番モード推奨）
3. セキュリティルールを設定：
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/persons/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### Firebase設定ファイル
`js/firebase-config.js` にFirebaseプロジェクトの設定値を記載：
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## PWAとしてのインストール

### Android (Chrome)
1. https://coop-keeper.web.app をChromeで開く
2. アドレスバーの「インストール」アイコンをタップ
3. 「インストール」を選択

### iOS (Safari)
1. https://coop-keeper.web.app をSafariで開く
2. 共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」を選択

## データ構造

各連絡先は以下の情報を持ちます：
- **基本情報**：名前、誕生日、関係性、電話番号、LINE
- **出会い情報**：場所、初回日、最終日
- **特徴**：顔の特徴、趣味・興味
- **詳細情報**：職業、出身地、年齢（誕生日から自動計算）、在住地、メールアドレス、SNS（Twitter/Instagram/Facebook）、その他SNS、メモ
- **写真**：プロフィール画像（自動圧縮）

## トラブルシューティング

### プロフィール画像が表示されない
- ブラウザのキャッシュをクリア
- 別のブラウザで試す
- しばらく時間をおいてから再試行

### PWAがインストールできない
- HTTPSでアクセスしているか確認
- ブラウザが最新版か確認
- manifest.jsonが正しく読み込まれているか確認

### Firebase認証エラー
- Firebase Consoleで承認済みドメインを確認
- ブラウザのサードパーティCookieが有効か確認

## 注意事項
- Firebase設定ファイル（`js/firebase-config.js`）は公開リポジトリにコミットしないでください
- 無料枠の制限があるため、大量のデータ保存には注意してください
- 個人情報を扱うため、適切なセキュリティ対策を実施してください

## 今後の機能追加案
- [ ] プッシュ通知
- [ ] 写真の複数枚登録
- [ ] データのエクスポート/インポート機能の改善
- [ ] 検索機能の強化（フィルタリング）
- [ ] タグ機能
- [ ] 共有機能
- [ ] カレンダー連携

## ライセンス
プライベートプロジェクト

## 作成者
Cooper Development Team

---
最終更新: 2025年1月