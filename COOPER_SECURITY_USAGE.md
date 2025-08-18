# Cooper Security Agent 使用ガイド

## 概要
Cooper Security Agent（`--persona-cooper-security`）は、個人情報管理アプリ「Cooper」専用のセキュリティ専門エージェントです。プライバシー保護、脆弱性対策、ユーザビリティセキュリティを包括的にカバーします。

## 使用方法

### 手動アクティベーション
```bash
# セキュリティ分析
/analyze --focus security --persona-cooper-security

# セキュリティ改善
/improve --security --persona-cooper-security

# プライバシー監査
/audit --privacy --persona-cooper-security

# セキュリティテスト
/test --security --persona-cooper-security
```

### 自動アクティベーション
以下のキーワードや状況で自動的に起動します：
- 「個人情報」「プライバシー」「Cooper」「人物管理」
- Firebase Authentication/Firestoreのセキュリティルール変更
- 個人情報を扱うコンポーネントの開発
- データエクスポート/インポート機能の実装

## 主要機能

### 1. プライバシー保護分析
```bash
# 個人情報の取り扱いを分析
/analyze @js/firestore-db.js --focus privacy --persona-cooper-security

# データ暗号化の実装状況をチェック
/analyze --focus encryption --persona-cooper-security
```

### 2. セキュリティ脆弱性検査
```bash
# XSS、CSRF、SQLインジェクション等の脆弱性をチェック
/test --security --comprehensive --persona-cooper-security

# Firebase Security Rulesの検証
/analyze @firestore.rules --persona-cooper-security
```

### 3. ユーザビリティセキュリティ評価
```bash
# セキュリティ機能の使いやすさを評価
/analyze --focus usability-security --persona-cooper-security

# エラーメッセージの安全性チェック
/improve --error-handling --persona-cooper-security
```

### 4. コンプライアンスチェック
```bash
# GDPR準拠状況の確認
/audit --gdpr --persona-cooper-security

# 個人情報保護法対応の確認
/audit --privacy-law-jp --persona-cooper-security
```

## 実装例

### セキュアなデータ保存
```javascript
// Cooper Security Agentが推奨する実装
class SecureDataStorage {
  async savePersonData(personData) {
    // 1. データ検証
    const validated = await this.validateData(personData);
    
    // 2. 機密情報の暗号化
    const encrypted = await PrivacyProtection.encryptSensitiveData(validated);
    
    // 3. セキュリティイベントログ
    SecurityMonitor.logSecurityEvent('data_save', {
      action: 'person_data_saved',
      dataType: 'personal_information'
    });
    
    // 4. Firestoreに保存
    return await db.collection('users')
      .doc(auth.currentUser.uid)
      .collection('persons')
      .add({
        ...encrypted,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastModified: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
}
```

### プライバシー設定UI
```javascript
// ユーザーフレンドリーなプライバシー管理
class PrivacySettings {
  renderPrivacyControls() {
    return `
      <div class="privacy-settings">
        <h3>プライバシー設定</h3>
        
        <!-- データ暗号化 -->
        <div class="setting-item">
          <label>
            <input type="checkbox" id="encrypt-data" checked>
            <span>個人情報を暗号化する</span>
          </label>
          <p class="help-text">電話番号、メールアドレスなどを暗号化して保存します</p>
        </div>
        
        <!-- データエクスポート -->
        <div class="setting-item">
          <button onclick="exportMyData()">
            自分のデータをダウンロード
          </button>
          <p class="help-text">GDPR準拠：いつでもデータをエクスポートできます</p>
        </div>
        
        <!-- データ削除 -->
        <div class="setting-item danger">
          <button onclick="deleteAllMyData()">
            すべてのデータを削除
          </button>
          <p class="help-text">警告：この操作は取り消せません</p>
        </div>
      </div>
    `;
  }
}
```

## 他のエージェントとの連携

### Frontend + Cooper Security
```bash
# セキュアなUIコンポーネントの作成
/build secure-input-component --persona-frontend --persona-cooper-security
```

### Backend + Cooper Security
```bash
# APIエンドポイントのセキュリティ強化
/improve @api/persons.js --security --persona-backend --persona-cooper-security
```

### QA + Cooper Security
```bash
# プライバシーコンプライアンステスト
/test --privacy-compliance --persona-qa --persona-cooper-security
```

## セキュリティチェックリスト

### 開発時
- [ ] 入力値の検証とサニタイゼーション
- [ ] 機密データの暗号化
- [ ] セキュアなセッション管理
- [ ] CSRFトークンの実装
- [ ] Content Security Policyの設定

### デプロイ前
- [ ] セキュリティヘッダーの確認
- [ ] Firebase Security Rulesのレビュー
- [ ] 依存関係の脆弱性スキャン
- [ ] ペネトレーションテスト
- [ ] プライバシーポリシーの更新

### 運用中
- [ ] セキュリティログの監視
- [ ] 定期的な脆弱性スキャン
- [ ] インシデント対応計画の更新
- [ ] ユーザーからのセキュリティ報告への対応
- [ ] 法規制の変更への対応

## トラブルシューティング

### エージェントが起動しない場合
```bash
# 明示的にエージェントを指定
--persona-cooper-security

# セキュリティ関連のキーワードを含める
/analyze "個人情報の暗号化" --focus security
```

### より詳細な分析が必要な場合
```bash
# 深い分析モードを併用
/analyze --think-hard --persona-cooper-security

# 複数のMCPサーバーを活用
/analyze --seq --c7 --persona-cooper-security
```

## 注意事項
- Cooper Security Agentは、一般的なセキュリティエージェントよりも個人情報保護に特化しています
- ユーザビリティを損なわないセキュリティ実装を重視します
- 日本の個人情報保護法とGDPRの両方に対応した推奨事項を提供します