@echo off
echo Cooper - 開発環境セットアップスクリプト
echo ======================================
echo.

REM Firebase設定ファイルのチェック
if not exist "js\firebase-config.js" (
    echo Firebase設定ファイルを作成します...
    copy js\firebase-config.js.example js\firebase-config.js
    echo √ js\firebase-config.js を作成しました
    echo.
    echo 重要: js\firebase-config.js を編集して、実際のFirebaseプロジェクトの値を入力してください
    echo.
) else (
    echo √ Firebase設定ファイルは既に存在します
)

REM アイコンディレクトリの作成
if not exist "icons" (
    echo アイコンディレクトリを作成します...
    mkdir icons
    echo √ icons\ ディレクトリを作成しました
) else (
    echo √ アイコンディレクトリは既に存在します
)

REM Firebase CLIのインストール確認
echo.
echo Firebase CLIの確認...
where firebase >nul 2>nul
if %errorlevel% equ 0 (
    echo √ Firebase CLIはインストール済みです
    firebase --version
) else (
    echo 警告: Firebase CLIがインストールされていません
    echo 以下のコマンドでインストールしてください:
    echo npm install -g firebase-tools
)

REM Node.jsのバージョン確認
echo.
echo Node.jsの確認...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo √ Node.jsはインストール済みです
    node --version
) else (
    echo 警告: Node.jsがインストールされていません
    echo https://nodejs.org/ からインストールしてください
)

echo.
echo ======================================
echo セットアップが完了しました！
echo.
echo 次のステップ:
echo 1. js\firebase-config.js を編集してFirebaseの設定を入力
echo 2. ローカルサーバーを起動:
echo    - Python 3: python -m http.server 8000
echo    - Node.js: npx serve
echo    - Firebase: firebase serve --only hosting
echo.
echo 詳細はREADME.mdを参照してください。
pause