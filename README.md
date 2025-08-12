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
│   ├── secure-firestore-db.js # Firestore操作（暗号化対応）
│   ├── crypto-utils.js   # 暗号化ユーティリティ
│   ├── encryption-migration.js # 暗号化マイグレーション
│   ├── key-rotation.js   # 暗号化キーローテーション
│   ├── key-rotation-ui.js # キーローテーションUI
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

### `js/secure-firestore-db.js`
- Firestoreとのデータ同期（暗号化対応）
- CRUD操作（作成・読取・更新・削除）
- リアルタイムデータ同期
- 機密情報の自動暗号化・復号化

### `js/crypto-utils.js`
- Web Crypto APIを使用した暗号化
- AES-GCM 256ビット暗号化
- 機密フィールドの選択的暗号化
- PBKDF2によるセキュアなキー導出

### `js/key-rotation.js` & `js/key-rotation-ui.js`
- 暗号化キーの定期的な更新
- キーローテーション管理UI（ダークモード対応）
- セキュリティ強化機能
- 暗号化状態の可視化

### `js/xss-safe-render.js`
- XSS攻撃の防止
- 安全なDOM操作ヘルパー
- ユーザー入力のサニタイゼーション

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
- ✅ 個人情報の暗号化保護
- ✅ 暗号化キーローテーション

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

#### npm scriptsを使用（推奨）
```bash
npm start
# または
npm run serve
```

#### Python 3の場合
```bash
npm run serve:python
# または直接
python -m http.server 8000
```

#### Firebase CLIの場合
```bash
npm run serve:firebase
# または直接
firebase serve --only hosting
```

ブラウザで `http://localhost:3000` (npm start) または `http://localhost:8000` (Python) にアクセス

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

### 暗号化される項目
以下の機密情報は、AES-GCM 256ビット暗号化でFirestoreに保存されます：
- 📱 **電話番号** (phone)
- 📧 **メールアドレス** (email)
- 💬 **LINE ID** (line)
- 🐦 **Twitter** (twitter)
- 📷 **Instagram** (instagram)
- 📘 **Facebook** (facebook)
- 🌐 **その他SNS** (sns)
- 🏠 **居住地** (residence)
- 📝 **メモ** (notes)
- 👤 **容姿の特徴** (features)

### 暗号化されない項目
以下の項目は、検索・表示のために平文で保存されます：
- 👤 **名前** (name)
- 🎂 **誕生日** (birthday)
- 🔢 **年齢** (age) - 誕生日から自動計算
- 🤝 **関係** (relationship)
- 📍 **ピン留め状態** (isPinned)
- 🖼️ **写真** (photo) - Base64形式
- 🆔 **ID** (id)
- 🕐 **更新日時** (updatedAt)

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

## セキュリティとプライバシー

### 暗号化技術
- **アルゴリズム**: AES-GCM 256ビット（認証付き暗号化）
- **キー導出**: PBKDF2（100,000回のイテレーション）
- **実装**: Web Crypto API（ブラウザネイティブ）
- **キーローテーション**: 定期的な暗号化キー更新機能

### セキュリティ機能
- ✅ クライアントサイド暗号化（機密情報のみ）
- ✅ ユーザーごとの独立した暗号化キー
- ✅ Firebase Authentication による認証
- ✅ Firestore セキュリティルールによるアクセス制御
- ✅ HTTPS通信の強制
- ✅ XSS対策（サニタイゼーション実装）
- ✅ キーローテーション管理UI（ダークモード対応）
- ✅ セキュリティ設定のサブメニュー階層化

## 注意事項
- Firebase設定ファイル（`js/firebase-config.js`）は公開リポジトリにコミットしないでください
- 無料枠の制限があるため、大量のデータ保存には注意してください
- 暗号化キーは各ユーザーのブラウザに保存されます（紛失にご注意ください）
- 定期的なキーローテーションを推奨します（設定メニューから実行可能）

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
最終更新: 2025年8月12日