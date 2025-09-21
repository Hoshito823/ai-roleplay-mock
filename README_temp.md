# AI商談プラットフォーム

感情解析技術を活用したAI商談ロールプレイシステム

## 概要

本システムは、営業担当者のスキル向上を目的とした AI 商談プラットフォームです。感情解析技術を活用し、リアルタイムで商談の練習と分析を行うことができます。

## 主要機能

### 1. ダッシュボード
- **KPI表示**: 商談成功率、平均商談時間、感情スコア推移
- **商談履歴**: 過去の商談記録一覧、検索・フィルタリング機能
- **進捗管理**: 個人・チーム別の成績トラッキング

### 2. AIロールプレイ機能
- **シナリオ選択**: 業界別・難易度別の商談シナリオ
- **リアルタイムチャット**: AI顧客との自然な対話
- **感情分析表示**: リアルタイムでの感情状態可視化
- **音声認識対応**: テキスト・音声両方での対話

### 3. 商談分析機能
- **グラフ表示**: 感情推移、発話時間分析、キーワード出現頻度
- **重要ポイント検出**: 商談の転換点、感情変化の瞬間特定
- **改善提案**: AIによる具体的な改善アドバイス
- **録画再生**: 商談の振り返り機能

## 技術仕様

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **UI**: React + TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **チャート**: Chart.js / Recharts
- **リアルタイム通信**: Socket.IO

### バックエンド
- **API**: Node.js + Express
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **認証**: NextAuth.js
- **感情解析**: Azure Cognitive Services / Google Cloud Natural Language API
- **AI対話**: OpenAI GPT-4 API

### インフラ
- **ホスティング**: Vercel (Frontend) + Railway (Backend)
- **ファイルストレージ**: AWS S3
- **監視**: Sentry

## データベース設計

### 主要テーブル
- `users`: ユーザー情報
- `scenarios`: 商談シナリオ
- `sessions`: 商談セッション
- `messages`: チャット履歴
- `emotion_analysis`: 感情分析結果
- `analytics`: 分析データ

## API設計

### 認証
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### ダッシュボード
- `GET /api/dashboard/kpi`
- `GET /api/dashboard/history`

### ロールプレイ
- `GET /api/scenarios`
- `POST /api/sessions`
- `GET /api/sessions/:id`
- `POST /api/sessions/:id/messages`
- `GET /api/sessions/:id/emotions`

### 分析
- `GET /api/analytics/:sessionId`
- `POST /api/analytics/:sessionId/feedback`

## セキュリティ

- JWT認証
- HTTPS必須
- データ暗号化
- 入力値検証
- Rate Limiting

## 開発環境セットアップ

```bash
# プロジェクトクローン
git clone <repository>
cd ai-sales-platform

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local

# データベースマイグレーション
npx prisma migrate dev

# 開発サーバー起動
npm run dev
```

## 環境変数

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=...
AZURE_COGNITIVE_SERVICES_KEY=...
```

## 今後の拡張予定

- モバイルアプリ対応
- 多言語対応
- チーム機能強化
- カスタムシナリオ作成
- 外部CRM連携