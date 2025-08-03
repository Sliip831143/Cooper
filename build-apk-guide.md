# Cooper APKビルドガイド

## 方法1: PWAとしてインストール（最も簡単）

1. **Firebaseホスティングにデプロイ**
   ```bash
   # Firebase CLIでログイン（ブラウザが開きます）
   firebase login
   
   # プロジェクトを初期化
   firebase init hosting
   
   # デプロイ
   firebase deploy
   ```

2. **スマホでアクセス**
   - デプロイされたURLにアクセス
   - Chromeメニューから「アプリをインストール」を選択

## 方法2: Capacitorを使用したネイティブAPKビルド

### 前提条件
- Node.js（インストール済み）
- Android Studio
- Java JDK 11以上

### 手順

1. **Capacitorをインストール**
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Capacitorを初期化**
   ```bash
   npx cap init "Cooper" "com.example.cooper" --web-dir="."
   ```

3. **capacitor.config.jsonを編集**
   ```json
   {
     "appId": "com.example.cooper",
     "appName": "Cooper",
     "webDir": ".",
     "server": {
       "androidScheme": "https"
     }
   }
   ```

4. **Androidプラットフォームを追加**
   ```bash
   npx cap add android
   ```

5. **Android Studioで開く**
   ```bash
   npx cap open android
   ```

6. **Android Studioでビルド**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - 生成されたAPKは `android/app/build/outputs/apk/debug/` にあります

## 方法3: PWABuilderを使用（オンラインツール）

1. https://www.pwabuilder.com/ にアクセス
2. デプロイ済みのURLを入力
3. Androidパッケージを生成
4. APKをダウンロード

## 注意事項

- Google認証を使用する場合は、SHA-1フィンガープリントをFirebaseに登録する必要があります
- デバッグ用とリリース用で異なるSHA-1が必要です
- リリース版はGoogle Play Consoleでの署名が必要です