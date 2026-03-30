# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # Start development server (Vite)
npm run build  # Build for production (outputs to dist/)
```

No test or lint scripts are configured.

## Architecture

This is a **React + Vite** single-page application — a group homepage with a marine/ocean theme, originally generated from a Figma design.

### Page Structure

`src/main.tsx` → `src/app/App.tsx` renders these sections top-to-bottom:

- `Header` — navigation
- `HeroSection` — top banner
- `AboutSection` — about content
- `MembersSection` — team members (Subara, ViVi)
- `VideoSection` — embedded videos
- `FanArtSection` — fan art gallery
- `QuestionBoxSection` — Q&A
- `Footer`

Background animations (`SeaCreatures`, `Bubbles`, `WaterSurface`) are layered via absolute/relative positioning.

### Key Conventions

- Path alias `@` maps to `src/` (configured in `vite.config.ts`)
- Styling: Tailwind CSS v4 (via `@tailwindcss/vite` plugin) + Emotion for styled components
- UI primitives: Radix UI and MUI components live in `src/app/components/ui/`
- Assets (images) imported directly in TSX files; types declared in `images.d.ts`
- **Do not remove** the `react()` or `tailwindcss()` plugins from `vite.config.ts` — both are required
- **Do not add** `.css`, `.tsx`, or `.ts` to `assetsInclude` in `vite.config.ts`

### Tech Stack

| Layer | Library |
|---|---|
| Build | Vite 6, TypeScript |
| UI | React 18, Radix UI, MUI, Lucide icons |
| Styling | Tailwind CSS v4, Emotion |
| Animation | Motion (Framer Motion successor) |
| Routing | React Router 7 |
| Forms | React Hook Form |

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