# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 開発サーバー起動
pnpm dev:web      # Next.js Web → localhost:3000
pnpm dev:mobile   # Expo モバイル開発サーバー
pnpm dev          # Web + Mobile 同時起動

# ビルド・Lint
pnpm build        # 全パッケージをビルド
pnpm lint         # 全パッケージをLint

# 依存関係インストール
pnpm install      # ルートで実行（全ワークスペース対象）
```

## Architecture

これは **RewriteAI** — AIを活用した文章リライト・トーン変換・翻訳ツール。
**Turborepo + pnpm** を使ったmonorepo構成。

### プロジェクト構成

```
rewrite-ai/
├── apps/
│   ├── web/          # Next.js 14 (App Router, TypeScript, Tailwind CSS)
│   └── mobile/       # Expo (React Native, TypeScript, Expo Router)
├── packages/
│   └── shared/       # 共通型定義・AI Router・プロンプトテンプレート
├── turbo.json        # Turboパイプライン定義
├── pnpm-workspace.yaml
└── package.json      # ルートスクリプト
```

### packages/shared の構成

```
packages/shared/src/
├── types/     # 共通型定義（RewriteRequest, User, AIConfig など）
├── ai-router/ # AI Router（Groq/Claude プロバイダ切替）
├── prompts/   # プロンプトテンプレート（リライト・トーン・翻訳）
└── utils/     # 共通ユーティリティ
```

### AI戦略（二段階構成）

- **Phase A（初期）**: Groq API 無料枠（Llama 3.3 70B / Llama 4 Scout）→ コスト¥0
- **Phase B（スケール時）**: Claude API（claude-sonnet-4-6）→ 高品質・有料
- 切替は環境変数 `AI_PROVIDER=groq|claude` で即座に対応

### Key Conventions

- `packages/shared` の型を Web・Mobile 両方からインポートして使う
- `@rewrite-ai/shared` パッケージ名でワークスペース参照
- Web の API Route (`apps/web/app/api/`) がバックエンドを担う
- AI Router レイヤーを挟むことで、フロント変更なしにAIプロバイダを切替可能

### Tech Stack

| レイヤー | 技術 |
|---|---|
| モノレポ | Turborepo + pnpm workspaces |
| Web | Next.js 14 (App Router), TypeScript strict |
| モバイル | Expo (React Native), Expo Router |
| 共通 | TypeScript strict, packages/shared |
| スタイリング | Tailwind CSS v3 (Web) |
| AI (Phase A) | Groq API（Llama 3.3 70B / Llama 4 Scout）|
| AI (Phase B) | Claude API（claude-sonnet-4-6）|
| DB・認証 | Supabase (PostgreSQL + Auth) |
| デプロイ (Web) | Vercel |
| デプロイ (Mobile) | EAS Build (Expo) |

## Mandatory Rules for Claude Code

- Do NOT modify any files unless explicitly instructed.
- Do NOT refactor existing code unless clearly requested.
- Prefer minimal, localized changes over large improvements.
- Stability and existing behavior are more important than code cleanliness.

## Change Proposal Requirement

Before making any code changes:
- Explain what will be changed
- Explain why it is necessary
- Describe potential risks or side effects

Wait for explicit approval before proceeding.

## Restricted Areas

The following areas must not be modified unless explicitly instructed:
- Readme

## 運営方針

- このプロジェクトは収益化を目指して運営する
- 運営コストは無料（無料ホスティング・無料サービスのみ使用）を維持する
- 有料サービスの導入は明示的な指示がある場合のみ検討する
- 収益化施策（広告、アフィリエイト等）の実装は指示に従い慎重に行う

## 個人開発サービス成功の教訓
（参考: https://qiita.com/jabba/items/1a49e860a09a613b09d4）

- **マネタイズは企画段階から考える** — 「後で考える」はNG。収益化を前提に機能を設計する
- **ターゲットを明確にする** — 誰のためのサービスかを常に意識して開発・改善する
- **成功事例を徹底的に参考にする** — 独自性より先にユーザーに価値を届けることを優先する
- **パフォーマンスを高める** — キャッシュ活用・高速レスポンスはユーザー体験に直結する
- **コストを抑えてサービスを長続きさせる** — 無料枠を最大限活用し、継続運営を優先する

## Security Rules

- Never request or output secrets, API keys, or credentials.
- Do not log or print personal data.
- Assume production-like constraints even in development.

## Cost Awareness

- Keep responses concise.
- Avoid repeating large code blocks unless necessary.
- Prefer explanation over full implementation when possible.

## Model Usage Policy

- Use the Default (recommended) model for all tasks.
- The Default model is currently Sonnet 4.5.
- Do NOT switch to Opus unless explicitly instructed by the user.
- Prefer lower-cost models unless higher capability is required.

## 言語設定
- 常に日本語で会話する
- コメントも日本語で記述する
- エラーメッセージの説明も日本語で行う
- ドキュメントも日本語で生成する

## コーディングルール
- すべてのコメントは日本語で記述
- 変数名・関数名は英語だが、その説明コメントは日本語
- TODOコメントも日本語で記載
- docstringも日本語で記述

## 出力設定
- console.log() のメッセージは日本語
- エラーメッセージは日本語で出力
- ユーザー向けの表示はすべて日本語
- デバッグメッセージも日本語

## 学習サポートルール

ユーザーはサイト作成を通じてプログラミングを学習中のため、以下を徹底すること：

- **新しく書いたコードには必ず処理の解説コメントを付ける**
- 「なぜこう書くのか」の意図を関数・ブロック単位でコメントに記載する
- 初めて登場する概念・構文（型定義、async/await、pandas の操作など）は
  コード内または回答文で簡潔に説明を加える
- 複雑なロジックは処理の流れをステップ形式でコメントに記載する
- ただし自明な1行（`return items` など）には不要なコメントを付けない