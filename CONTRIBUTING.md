# Contributing to Cooper

Cooperプロジェクトへの貢献をありがとうございます！このドキュメントでは、プロジェクトへの貢献方法について説明します。

## 行動規範

このプロジェクトに参加するすべての人は、お互いに敬意を持って接することを期待されています。

## 貢献の方法

### バグ報告

1. 既存のIssueに同じ問題が報告されていないか確認
2. 新しいIssueを作成（バグ報告テンプレートを使用）
3. 以下の情報を含める：
   - バグの詳細な説明
   - 再現手順
   - 期待される動作
   - 実際の動作
   - スクリーンショット（可能であれば）
   - 環境情報（ブラウザ、OS等）

### 機能提案

1. 既存のIssueに同じ提案がないか確認
2. 新しいIssueを作成（機能要望テンプレートを使用）
3. 以下の情報を含める：
   - 機能の詳細な説明
   - なぜこの機能が必要か
   - 実装のアイデア（あれば）

### プルリクエスト

1. フォークしてクローン
2. 新しいブランチを作成: `git checkout -b feature/your-feature-name`
3. 変更をコミット（コミットメッセージガイドラインに従う）
4. ブランチをプッシュ: `git push origin feature/your-feature-name`
5. プルリクエストを作成

## 開発環境のセットアップ

1. リポジトリをクローン
   ```bash
   git clone https://github.com/your-username/cooper.git
   cd cooper
   ```

2. Firebase設定
   ```bash
   cp js/firebase-config.js.example js/firebase-config.js
   # firebase-config.js を編集して実際の値を入力
   ```

3. ローカルサーバーを起動
   ```bash
   python -m http.server 8000
   # または
   npx serve
   ```

## コーディング規約

### JavaScript

- ES6+の機能を積極的に使用
- セミコロンは必須
- インデントは4スペース
- 変数名はcamelCase
- 定数名はUPPER_SNAKE_CASE
- 関数は明確で説明的な名前を使用

```javascript
// 良い例
const MAX_RETRY_COUNT = 3;
function getUserData(userId) {
    // 処理
}

// 悪い例
const max = 3
function getData(id) {
    // 処理
}
```

### HTML/CSS

- セマンティックなHTML5タグを使用
- CSSクラス名はBEM記法またはkebab-case
- Material Design 3のガイドラインに従う

### コメント

- 複雑なロジックには必ずコメントを追加
- JSDocスタイルでの関数コメントを推奨

```javascript
/**
 * ユーザー情報を取得する
 * @param {string} userId - ユーザーID
 * @returns {Promise<Object>} ユーザー情報オブジェクト
 */
async function getUserData(userId) {
    // 処理
}
```

## コミットメッセージガイドライン

以下の形式でコミットメッセージを作成：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット等）
- `refactor`: バグ修正でも機能追加でもないコード変更
- `perf`: パフォーマンス改善
- `test`: テストの追加や修正
- `chore`: ビルドプロセスやツールの変更

### 例
```
feat(auth): Google認証のエラーハンドリングを改善

認証エラー時により詳細なエラーメッセージを表示するように改善。
ユーザーが問題を理解しやすくなる。

Closes #123
```

## ブランチ戦略

- `main`: 本番環境にデプロイされるブランチ
- `develop`: 開発用ブランチ
- `feature/*`: 新機能開発用
- `bugfix/*`: バグ修正用
- `hotfix/*`: 緊急修正用

## テスト

プルリクエストを送る前に以下を確認：

1. すべての既存機能が正常に動作すること
2. 新機能が異なるブラウザで動作すること
3. コンソールにエラーが出ていないこと
4. レスポンシブデザインが維持されていること

## レビュープロセス

1. すべてのプルリクエストは最低1人のレビューが必要
2. CI/CDのチェックがすべてパスすること
3. コンフリクトが解決されていること
4. コーディング規約に従っていること

## 質問やサポート

質問がある場合は：
1. まずドキュメントを確認
2. 既存のIssueを検索
3. それでも解決しない場合は新しいIssueを作成

ありがとうございます！ 🎉