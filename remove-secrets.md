# GitHubから機密情報を削除する手順

## 方法1: BFG Repo-Cleanerを使用（推奨）

### 1. BFG Repo-Cleanerをダウンロード

1. [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)にアクセス
2. 最新版の`bfg-x.x.x.jar`をダウンロード
3. ダウンロードしたファイルをCooperプロジェクトのディレクトリに配置

または、PowerShellで直接ダウンロード：
```powershell
# PowerShellで実行
Invoke-WebRequest -Uri "https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar" -OutFile "bfg.jar"
```

### 2. リポジトリのクローンを作成

```powershell
# 現在のディレクトリから一つ上に移動
cd ..

# リポジトリのミラークローンを作成
git clone --mirror https://github.com/Sliip831143/Cooper.git Cooper-mirror.git
```

### 3. BFGで機密ファイルを削除

```powershell
# BFGを実行
java -jar C:\Users\t-oku\file\learn\Cooper\bfg.jar --delete-files firebase-config.js Cooper-mirror.git
```

### 4. 履歴をクリーンアップ

```powershell
cd Cooper-mirror.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 5. 変更をプッシュ

```powershell
# 強制プッシュ（注意：履歴が書き換わります）
git push --force
```

## 方法2: git filter-branchを使用（BFGが使えない場合）

```powershell
# Cooperディレクトリに戻る
cd C:\Users\t-oku\file\learn\Cooper

# バックアップを作成
git checkout -b backup-branch

# mainブランチに戻る
git checkout main

# filter-branchで履歴から削除
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch www/js/firebase-config.js" --prune-empty --tag-name-filter cat -- --all

# 強制プッシュ
git push origin --force --all
git push origin --force --tags
```

## 方法3: 新しいリポジトリを作成（最も簡単だが履歴を失う）

1. 現在のコードをバックアップ
2. GitHubで新しいリポジトリを作成
3. 機密情報を削除した状態でプッシュ

```powershell
# 新しいディレクトリを作成
cd ..
mkdir Cooper-clean
cd Cooper-clean

# 必要なファイルをコピー（www/js/firebase-config.jsを除く）
# ※手動でファイルをコピーするか、以下のコマンドを使用
robocopy C:\Users\t-oku\file\learn\Cooper . /E /XD .git www\js /XF firebase-config.js

# 新しいGitリポジトリとして初期化
git init
git add .
git commit -m "Initial commit without secrets"
git remote add origin https://github.com/Sliip831143/Cooper-new.git
git push -u origin main
```

## 重要な注意事項

- **APIキーは既に公開されているため、必ず新しいキーに変更してください**
- 履歴を書き換えると、他の人がクローンしている場合は再クローンが必要
- 作業前に必ずバックアップを取ってください

## 推奨される手順

1. まず新しいFirebase APIキーを生成
2. BFG Repo-Cleanerをダウンロード
3. 上記の方法1を実行
4. 環境変数方式で新しいキーを設定