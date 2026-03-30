# Week 1: プロジェクトセットアップ 詳細手順書

この手順書は、Claude Codeへの指示テンプレートとしてそのまま使えるように構成しています。
各ステップを順番にClaude Codeに渡してください。

---

## 全体像

```
rewrite-ai/
├── apps/
│   ├── web/                  # Next.js 14 (App Router)
│   └── mobile/               # Expo (React Native)
├── packages/
│   ├── shared/               # 共通の型定義・ユーティリティ
│   │   ├── src/
│   │   │   ├── types/        # 共通型定義
│   │   │   ├── ai-router/    # AI Router（Groq/Claude切替）
│   │   │   ├── prompts/      # プロンプトテンプレート
│   │   │   └── utils/        # 共通ユーティリティ
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ui/                   # 共通UIコンポーネント（任意）
├── turbo.json
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Step 1: monorepo初期化

### Claude Codeへの指示

```
Turborepoを使ったmonorepoプロジェクトを初期化してください。

プロジェクト名: rewrite-ai

構成:
- apps/web: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- apps/mobile: Expo (React Native, TypeScript, Expo Router)
- packages/shared: 共通のTypeScript型定義・ユーティリティ

要件:
- パッケージマネージャはpnpmを使用
- TypeScriptのstrictモードを有効に
- turbo.jsonにbuild, dev, lintのパイプラインを定義
- ルートのpackage.jsonに以下のscriptsを定義:
  - "dev:web": "turbo run dev --filter=web"
  - "dev:mobile": "turbo run dev --filter=mobile"
  - "dev": "turbo run dev"
  - "build": "turbo run build"
  - "lint": "turbo run lint"
```

### 確認ポイント

セットアップ後、以下が動作するか確認してください。

```bash
cd rewrite-ai
pnpm dev:web     # → localhost:3000 でNext.jsが起動
pnpm dev:mobile  # → Expoの開発サーバーが起動
```

---

## Step 2: 共通型定義の作成

### Claude Codeへの指示

```
packages/shared/src/types/index.ts に以下の共通型定義を作成してください。

// --- リライト関連 ---

// リライトのモード
type RewriteMode = "rewrite" | "tone" | "translate";

// トーン変換のオプション
type ToneOption = "casual" | "formal" | "polite" | "friendly";

// リライトのオプション
type RewriteOption = "natural" | "concise" | "persuasive";

// 翻訳のオプション
type TranslateOption = "ja_to_en" | "en_to_ja";

// 全オプションの統合型
type ModeOption = ToneOption | RewriteOption | TranslateOption;

// APIリクエスト
interface RewriteRequest {
  text: string;          // 入力テキスト（最大2000文字）
  mode: RewriteMode;
  option: ModeOption;
}

// APIレスポンス
interface RewriteResponse {
  id: string;
  inputText: string;
  outputText: string;
  mode: RewriteMode;
  option: ModeOption;
  createdAt: string;
}

// --- ユーザー関連 ---

type PlanType = "free" | "pro";

interface User {
  id: string;
  email: string;
  plan: PlanType;
  dailyCount: number;
  dailyResetAt: string;
  createdAt: string;
}

// --- AI Router関連 ---

type AIProvider = "groq" | "claude";

interface AIConfig {
  provider: AIProvider;
  model: string;
  maxTokens: number;
}

// --- 定数 ---

const FREE_DAILY_LIMIT = 5;
const MAX_INPUT_LENGTH = 2000;
const GROQ_CONFIG: AIConfig = {
  provider: "groq",
  model: "llama-3.3-70b-versatile",
  maxTokens: 2048,
};
const CLAUDE_CONFIG: AIConfig = {
  provider: "claude",
  model: "claude-sonnet-4-6",
  maxTokens: 2048,
};

すべてexportしてください。
packages/shared/package.json のmainとtypesを
src/index.ts（バレルファイル）に向けてください。
```

---

## Step 3: AI Routerの実装

### Claude Codeへの指示

```
packages/shared/src/ai-router/index.ts にAI Routerを実装してください。

要件:
- 環境変数 AI_PROVIDER ("groq" | "claude") でプロバイダを切替
- 環境変数が未設定の場合はデフォルトで "groq" を使用
- 将来的にユーザーのプランに応じて切り替える拡張性を持たせる

実装内容:

1. getAIConfig(userPlan?: PlanType): AIConfig
   - 引数なし or "free" → GROQ_CONFIG を返す
   - "pro" → 環境変数 AI_PROVIDER に従う（デフォルトはclaude）
   - 将来のハイブリッド戦略に対応

2. callGroq(prompt: string, config: AIConfig): Promise<string>
   - groq-sdk を使用
   - 環境変数 GROQ_API_KEY を使用
   - ストリーミング対応（オプション）
   - レート制限エラー時のリトライ（最大3回、指数バックオフ）

3. callClaude(prompt: string, config: AIConfig): Promise<string>
   - @anthropic-ai/sdk を使用
   - 環境変数 ANTHROPIC_API_KEY を使用
   - ストリーミング対応（オプション）

4. rewrite(request: RewriteRequest, userPlan?: PlanType): Promise<string>
   - メインのエントリポイント
   - getAIConfig → buildPrompt → callGroq or callClaude
   - エラーハンドリング付き

依存パッケージ:
- groq-sdk
- @anthropic-ai/sdk

これらをpackages/shared/package.jsonのdependenciesに追加してください。
```

---

## Step 4: プロンプトテンプレートの作成

### Claude Codeへの指示

```
packages/shared/src/prompts/index.ts にプロンプトテンプレートを実装してください。

要件:
- buildPrompt(request: RewriteRequest): string 関数を作成
- mode に応じて適切なプロンプトを生成

プロンプト設計:

【リライトモード (mode: "rewrite")】
---
あなたは文章リライトの専門家です。
以下のテキストを指定されたスタイルにリライトしてください。

スタイル: {optionの日本語名}
- natural: より自然で読みやすい文章に
- concise: より簡潔で要点を押さえた文章に
- persuasive: より説得力のある文章に

ルール:
- 元の意味を変えないこと
- 自然な日本語であること
- リライト結果のみを返すこと（説明や前置き不要）

入力テキスト:
{text}
---

【トーン変換モード (mode: "tone")】
---
あなたは文章のトーン変換の専門家です。
以下のテキストを指定されたトーンに変換してください。

トーン: {optionの日本語名}
- casual: 友人に話すようなカジュアルな文体
- formal: ビジネス文書にふさわしいフォーマルな文体
- polite: 丁寧で敬語を使った文体
- friendly: 親しみやすく温かみのある文体

ルール:
- 元の意味を変えないこと
- 自然な日本語であること
- 変換結果のみを返すこと（説明や前置き不要）

入力テキスト:
{text}
---

【翻訳モード (mode: "translate")】
---
あなたはプロの翻訳者です。
以下のテキストを{対象言語}に翻訳してください。

- ja_to_en: 英語に翻訳
- en_to_ja: 日本語に翻訳

ルール:
- 自然な{対象言語}であること
- 直訳ではなく意訳を心がけること
- 翻訳結果のみを返すこと（説明や前置き不要）

入力テキスト:
{text}
---

optionの日本語マッピングも定数として定義してください。
```

---

## Step 5: 環境変数の設定

### Claude Codeへの指示

```
プロジェクトルートに .env.example を作成してください。

内容:
# =========================
# AI Provider設定
# =========================
# "groq" (デフォルト・無料) or "claude" (スケール時)
AI_PROVIDER=groq

# Groq API Key（無料で取得: https://console.groq.com）
GROQ_API_KEY=gsk_xxxxxxxxxxxx

# Anthropic API Key（Phase B以降: https://console.anthropic.com）
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx

# =========================
# Supabase設定
# =========================
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxx

# =========================
# Stripe設定（Week 5で使用）
# =========================
# STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx

# =========================
# アプリ設定
# =========================
NEXT_PUBLIC_APP_URL=http://localhost:3000

また、.gitignore に .env, .env.local が含まれていることを確認してください。
apps/web/.env.local と apps/mobile/.env も .gitignore に追加してください。
```

---

## Step 6: Next.js APIルートの雛形作成

### Claude Codeへの指示

```
apps/web/app/api/rewrite/route.ts にリライトAPIの雛形を作成してください。

要件:
- POSTメソッドのみ受付
- リクエストボディのバリデーション:
  - text: 必須、1〜2000文字
  - mode: "rewrite" | "tone" | "translate"
  - option: modeに応じた有効な値
- packages/shared の rewrite() 関数を呼び出し
- エラーハンドリング:
  - バリデーションエラー → 400
  - レート制限到達 → 429（Retry-Afterヘッダー付き）
  - AI APIエラー → 502
  - その他 → 500
- レスポンス形式: { success: boolean, data?: RewriteResponse, error?: string }
- CORS設定（モバイルアプリからのアクセス用）

※ 認証チェックとデータベース保存はWeek 4で追加するため、
   今はTODOコメントで場所だけ示しておいてください。
```

---

## Step 7: Supabaseプロジェクトの作成

### 手動で行う作業（Claude Codeの外で実施）

```
1. https://supabase.com にアクセスしてアカウント作成（無料）

2. 新規プロジェクトを作成
   - プロジェクト名: rewrite-ai
   - リージョン: Northeast Asia (Tokyo) を推奨
   - パスワード: 安全なものを設定（DBアクセス用）

3. プロジェクトが作成されたら、以下を控える:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL に設定
   - anon key → NEXT_PUBLIC_SUPABASE_ANON_KEY に設定
   - service_role key → SUPABASE_SERVICE_ROLE_KEY に設定

4. .env.local ファイルを作成し、上記の値を設定
```

### Claude Codeへの指示（テーブル作成SQL）

```
Supabaseのダッシュボード > SQL Editor で実行するテーブル作成SQLを
supabase/migrations/001_initial_schema.sql として作成してください。

テーブル:

1. profiles テーブル
   - id: uuid (PK, auth.usersのidと連携)
   - email: text not null
   - plan: text not null default 'free' (check: 'free' or 'pro')
   - daily_count: integer not null default 0
   - daily_reset_at: timestamptz not null default now()
   - created_at: timestamptz not null default now()
   - updated_at: timestamptz not null default now()

2. rewrites テーブル
   - id: uuid (PK, default gen_random_uuid())
   - user_id: uuid (FK → profiles.id, on delete cascade)
   - input_text: text not null
   - output_text: text not null
   - mode: text not null (check: 'rewrite', 'tone', 'translate')
   - option: text not null
   - is_favorite: boolean not null default false
   - created_at: timestamptz not null default now()

3. RLS (Row Level Security) ポリシー:
   - profiles: ユーザーは自分のレコードのみ読み書き可能
   - rewrites: ユーザーは自分のレコードのみ読み書き可能

4. インデックス:
   - rewrites: user_id, created_at (降順) の複合インデックス

5. トリガー:
   - profiles.updated_at を自動更新するトリガー
   - auth.users に新規ユーザーが作成されたら profiles に自動挿入するトリガー
```

---

## Step 8: Groq APIキーの取得

### 手動で行う作業（Claude Codeの外で実施）

```
1. https://console.groq.com にアクセス
2. GoogleアカウントまたはメールでサインアップType（無料・クレカ不要）
3. 左メニュー「API Keys」→「Create API Key」
4. キー名: rewrite-ai-dev
5. 生成されたキー（gsk_で始まる）をコピー
6. .env.local の GROQ_API_KEY に設定

所要時間: 約2分
```

---

## Step 9: 動作確認

### Claude Codeへの指示

```
apps/web/app/page.tsx に簡易テスト用UIを作成してください。

要件:
- テキストエリア（入力用）
- モード選択ドロップダウン（rewrite / tone / translate）
- オプション選択ドロップダウン（モードに応じて変化）
- 「変換する」ボタン
- 結果表示エリア
- ローディング表示
- エラー表示

この画面から /api/rewrite にPOSTして結果を表示するだけのシンプルな画面。
スタイルはTailwind CSSで最低限整えるだけでOK（本格的なUIはWeek 2で作成）。

目的: AI Router → Groq API の疎通確認
```

### 動作確認チェックリスト

```bash
# 1. 開発サーバー起動
pnpm dev:web

# 2. ブラウザで http://localhost:3000 を開く

# 3. 以下をテスト:
#    入力: 「明日の会議は13時からです。よろしくお願いします。」
#    モード: tone
#    オプション: casual
#    期待結果: 「明日の会議13時からだよ〜。よろしく！」のようなカジュアルな文

# 4. 確認項目:
#    □ Groq APIが正常に応答する
#    □ リライト結果が画面に表示される
#    □ 日本語が正しく処理される
#    □ エラー時に適切なメッセージが表示される
```

---

## Step 10: Git初期化 & 初回コミット

### Claude Codeへの指示

```
Gitリポジトリを初期化し、初回コミットを行ってください。

1. git init
2. .gitignore が以下を含んでいることを確認:
   - node_modules/
   - .next/
   - .expo/
   - .env
   - .env.local
   - .env.*.local
   - dist/
   - .turbo/
3. git add .
4. git commit -m "feat: initial project setup with Turborepo monorepo

- Next.js 14 (App Router) web app
- Expo (React Native) mobile app
- Shared packages (types, AI router, prompts)
- AI Router with Groq/Claude provider switching
- Supabase schema migration
- Basic rewrite API endpoint
- Test UI for API verification"

また、README.md を以下の内容で作成してください:
- プロジェクト概要（RewriteAIの説明）
- 技術スタック一覧
- セットアップ手順（pnpm install → 環境変数設定 → pnpm dev）
- プロジェクト構成図
- 開発コマンド一覧
```

---

## Week 1 完了チェックリスト

Week 1の最後に、以下がすべて完了していることを確認してください。

```
基盤:
□ Turborepo monorepoが構成されている
□ pnpm dev:web でNext.jsが起動する
□ pnpm dev:mobile でExpoが起動する
□ packages/shared がweb/mobileから参照できる

AI:
□ AI Routerが実装されている（Groq/Claude切替）
□ Groq APIキーが取得・設定されている
□ プロンプトテンプレートが3モード分作成されている
□ /api/rewrite エンドポイントが動作する

データベース:
□ Supabaseプロジェクトが作成されている
□ テーブル作成SQLが準備されている
□ 環境変数が設定されている

テスト:
□ テスト用UIからリライトが実行できる
□ Groq API経由で日本語のリライトが正しく返る
□ エラー時に適切なハンドリングがされる

バージョン管理:
□ Gitリポジトリが初期化されている
□ 初回コミットが完了している
□ .gitignoreが適切に設定されている
□ README.mdが作成されている
```

---

## トラブルシューティング

### よくある問題と対処法

**Q: pnpm dev:web でモジュール解決エラーが出る**
→ packages/shared のビルドが必要な場合があります。
```bash
pnpm --filter shared build
# または tsconfig の paths 設定を確認
```

**Q: Groq APIから429エラー（レート制限）が返る**
→ 無料枠は30 RPM（1分あたり30リクエスト）です。
  開発中に連続テストしすぎると到達します。
  1分待ってから再試行してください。

**Q: Expoの起動でエラーが出る**
→ 以下を確認:
```bash
npx expo doctor  # Expoの依存関係チェック
```

**Q: TypeScriptの型エラーが出る**
→ packages/shared の型がexportされているか確認:
```bash
# packages/shared/src/index.ts にバレルexportがあるか
# tsconfig.json の paths 設定が正しいか
```

---

## Week 2 の予告

Week 1が完了したら、次はUIコンポーネントの本格開発です。

- 入力画面（テキストエリア、モードセレクター、トーンチップ）
- 結果画面（Before/After、コピー、再変換）
- タブナビゲーション（ホーム / 履歴 / 設定）
- ダークモード対応
- Web / モバイル両方のUI

Week 2の手順書が必要になったら、またお声がけください！
