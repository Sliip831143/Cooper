# Cooper セットアップガイド

## 環境変数の設定

Cooperアプリケーションを動作させるには、Firebase設定を環境変数として設定する必要があります。

### 手順

1. **環境変数ファイルの作成**
   ```bash
   # プロジェクトルートで実行
   cp env.template.js env.js
   ```

2. **Firebase設定の取得**
   - [Firebase Console](https://console.firebase.google.com/)にログイン
   - プロジェクトを選択
   - プロジェクトの設定 → 全般 → 「マイアプリ」セクション
   - Webアプリの設定情報をコピー

3. **env.jsファイルの編集**
   ```javascript
   window.ENV = {
       FIREBASE_CONFIG: {
           apiKey: "あなたのAPIキー",
           authDomain: "あなたのプロジェクト.firebaseapp.com",
           projectId: "あなたのプロジェクトID",
           storageBucket: "あなたのプロジェクト.appspot.com",
           messagingSenderId: "メッセージングセンダーID",
           appId: "アプリID",
           measurementId: "測定ID"
       }
   };
   ```

4. **アプリケーションの起動**
   - `index.html`をブラウザで開く
   - または、ローカルサーバーを起動:
     ```bash
     # Python 3の場合
     python -m http.server 8000
     
     # Node.jsの場合
     npx http-server
     ```

### 重要な注意事項

- ⚠️ **env.jsファイルは絶対にGitにコミットしないでください**
- `.gitignore`に`env.js`が含まれていることを確認してください
- 本番環境では、より安全な方法（環境変数、シークレット管理サービスなど）を使用することを推奨します

### トラブルシューティング

**「Firebase設定が見つかりません」エラーが表示される場合:**
1. `env.js`ファイルが存在することを確認
2. ファイル名が正しいことを確認（`env.js`であること）
3. `index.html`と同じディレクトリにあることを確認
4. ブラウザの開発者ツールでコンソールエラーを確認

**認証エラーが発生する場合:**
1. Firebase Consoleで認証が有効になっていることを確認
2. Googleサインインが有効になっていることを確認
3. 承認済みドメインにローカルホストが含まれていることを確認