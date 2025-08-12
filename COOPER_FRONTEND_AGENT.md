# COOPER_FRONTEND_AGENT.md

## Cooper PWA フロントエンドUI/UXスペシャリストAgent

### Agent概要
このAgentは、Cooper PWAアプリケーションのフロントエンドUI/UXを専門的に分析・改善するために設計されました。

### 専門分野
1. **クロスデバイス対応**
   - PC、タブレット、スマートフォンの最適化
   - レスポンシブデザインの実装
   - タッチ・マウス両対応のインタラクション

2. **最新デザイントレンド**
   - Material Design 3の完全実装
   - モダンUIパターン（グラスモーフィズム等）
   - マイクロインタラクションとアニメーション

3. **アクセシビリティ**
   - WCAG 2.1 AAA準拠
   - スクリーンリーダー完全対応
   - キーボードナビゲーション最適化

## 分析結果サマリー

### 🚨 クリティカルな問題点

#### 1. タッチターゲットサイズ
- **現状**: ボタンの高さが40px（WCAG AAA推奨は44px以上）
- **影響**: モバイルでの操作性が低下
- **優先度**: 高

#### 2. ARIAラベルの不足
- **現状**: フォーム入力、アイコンボタンにaria-label属性が不足
- **影響**: スクリーンリーダーユーザーが操作困難
- **優先度**: 高

#### 3. キーボードナビゲーション
- **現状**: フォーカスインジケーターが不明瞭、タブ順序が未整理
- **影響**: キーボードのみでの操作が困難
- **優先度**: 高

### 💡 改善提案

#### 1. アクセシビリティの向上
```css
/* フォーカスインジケーターの改善 */
*:focus-visible {
    outline: 3px solid var(--md-sys-color-primary);
    outline-offset: 2px;
    border-radius: var(--md-sys-shape-corner-small);
}

/* タッチターゲットの拡大 */
.btn-icon,
.calendar-btn,
.sns-btn {
    min-width: 44px !important;
    min-height: 44px !important;
}
```

#### 2. モダンUI実装
- スケルトンローダー
- グラスモーフィズム効果
- リップルエフェクト
- スムーズなトランジション

#### 3. レスポンシブデザイン強化
- スワイプジェスチャー対応
- ブレークポイントの最適化
- ランドスケープモード対応

## 実装優先順位

### Phase 1: 必須改善項目（1-2週間）
1. タッチターゲットサイズの修正
2. ARIAラベルの追加
3. キーボードナビゲーションの実装
4. カラーコントラストの改善

### Phase 2: UI/UX向上（3-4週間）
1. スケルトンローダーの実装
2. Material Design 3の完全実装
3. マイクロインタラクションの追加
4. モダンUIパターンの適用

### Phase 3: 高度な最適化（5-6週間）
1. パフォーマンス最適化
2. PWA機能の強化
3. オフライン体験の向上
4. アニメーションの洗練

## テスト項目

### アクセシビリティテスト
- [ ] NVDA/JAWS/VoiceOverでの動作確認
- [ ] キーボードのみでの全機能操作
- [ ] カラーコントラスト比の検証（WCAG AAA）
- [ ] ARIAラベルの適切性確認

### クロスデバイステスト
- [ ] iPhone Safari（iOS 14+）
- [ ] Android Chrome（Android 8+）
- [ ] iPad（縦向き・横向き）
- [ ] デスクトップ（Chrome, Firefox, Edge）

### パフォーマンステスト
- [ ] Lighthouse スコア 95+
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

## 推奨ツール

### 開発ツール
- Chrome DevTools（Lighthouse, Accessibility）
- axe DevTools（アクセシビリティ監査）
- WAVE（Web Accessibility Evaluation Tool）

### デザインツール
- Figma（Material Design 3 キット）
- Adobe XD（プロトタイピング）

### テストツール
- BrowserStack（クロスブラウザテスト）
- Percy（ビジュアルリグレッションテスト）

## メンテナンス指針

### 定期監査
- 月次：アクセシビリティ監査
- 四半期：パフォーマンス監査
- 年次：デザインシステム更新確認

### ドキュメント更新
- UI変更時は必ずスタイルガイドを更新
- アクセシビリティ要件の文書化
- デバイス別の動作仕様書作成

---

最終更新: 2025年8月12日
作成者: Cooper Frontend UI/UX Specialist Agent