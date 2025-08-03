# Cooper ウェブアプリ デプロイ手順

## 概要
CooperはPWA（Progressive Web App）として動作する、出会った人の情報を記録・管理するウェブアプリケーションです。

## Firebase Hosting へのデプロイ手順

### 1. Firebase Console での設定
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト「coop-keeper」を選択
3. 「Authentication」→「Sign-in method」で Google を有効化
4. 「Authentication」→「Settings」→「Authorized domains」に以下を追加：
   - `localhost` (開発用)
   - `coop-keeper.web.app`
   - `coop-keeper.firebaseapp.com`
   - カスタムドメイン（使用する場合）

### 2. Firebase CLI のインストール
```bash
npm install -g firebase-tools
```

### 3. Firebase プロジェクトの初期化
```bash
firebase login
firebase init hosting
```

設定時の選択：
- プロジェクト: `coop-keeper`
- Public directory: `.` (現在のディレクトリ)
- Single-page app: `No`
- GitHub Actions: お好みで設定

### 4. デプロイ
```bash
firebase deploy --only hosting
```

### 5. デプロイ後の確認
- https://coop-keeper.web.app
- https://coop-keeper.firebaseapp.com

## その他のホスティングオプション

### GitHub Pages
1. リポジトリの Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. Firebase設定のauthDomainをGitHub Pagesのドメインに追加

### Netlify / Vercel
1. GitHubリポジトリと連携
2. Build設定は不要（静的サイト）
3. 環境変数は不要（Firebaseの設定はクライアントサイド）
4. デプロイ後、カスタムドメインをFirebase Authenticationの承認済みドメインに追加

## 注意事項
- Google認証を使用するため、HTTPSでのホスティングが必須です
- ローカル開発時は `http://localhost` または `http://127.0.0.1` を使用してください
- カスタムドメインを使用する場合は、必ずFirebase ConsoleのAuthentication設定に追加してください

## ローカルでのテスト
```bash
# Python 3
python -m http.server 8000

# または Node.js
npx serve

# または Firebase CLI
firebase serve --only hosting
```

ブラウザで `http://localhost:8000` にアクセスしてテスト