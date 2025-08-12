# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 🔐 **セキュリティ機能の大幅強化**
  - AES-GCM 256ビット暗号化による個人情報保護
  - クライアントサイド暗号化の実装（機密フィールドの自動暗号化）
  - 暗号化キーローテーション機能
  - XSS（クロスサイトスクリプティング）対策の実装
  - セキュリティ設定用のサブメニュー階層
  - Cooper専用セキュリティペルソナ（Frontend Sub Agent）の作成
- 🎨 **UI/UX改善**
  - キーローテーションUIのダークモード対応
  - ローディング画面の実装（暗号化処理中の表示）
  - 画像全画面表示機能
  - セレクトボックスの矢印とLINEアイコンのデザイン修正
- 📱 **PWA機能**
  - Progressive Web App (PWA) サポート
  - オフライン機能（Service Worker）
  - カスタムアイコン
  - Bree Serifフォントをロゴに適用

### Changed
- APK形式からウェブアプリケーションへ完全移行
- Google認証をウェブ専用に最適化
- Firebaseセキュリティルールの強化
- 個人情報の保存方法を暗号化対応に変更

### Security
- Firebase API キーの露出問題を修正
- 個人情報（電話番号、メール、SNS情報等）の暗号化保存
- XSS脆弱性の修正（innerHTML使用箇所のサニタイゼーション）
- PBKDF2によるセキュアなキー導出（100,000回のイテレーション）

### Removed
- Capacitor関連のコードとAndroidビルド設定
- 平文での個人情報保存機能

## [1.0.0] - 2024-XX-XX

### Added
- 初回リリース
- Googleアカウントでのサインイン/サインアウト機能
- 個人情報の記録機能（名前、年齢、誕生日、出会った場所、趣味など）
- 写真のアップロード機能
- データの検索・ソート機能
- データのエクスポート/インポート機能
- ダークモード対応
- モバイル対応レスポンシブデザイン
- Firebase AuthenticationとFirestoreの統合
- Material Design 3を採用したUI

[Unreleased]: https://github.com/your-username/cooper/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-username/cooper/releases/tag/v1.0.0