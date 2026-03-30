// ================================================================
// RewriteAI 共通型定義
// Web (Next.js) と Mobile (Expo) の両方で使われる
// ================================================================

// --- リライト関連 ---

/** リライトの3つのモード */
export type RewriteMode = "rewrite" | "tone" | "translate";

/** トーン変換のオプション */
export type ToneOption = "casual" | "formal" | "polite" | "friendly";

/** リライトスタイルのオプション */
export type RewriteOption = "natural" | "concise" | "persuasive";

/** 翻訳方向のオプション */
export type TranslateOption = "ja_to_en" | "en_to_ja";

/** すべてのオプションを統合した型（ユニオン型） */
export type ModeOption = ToneOption | RewriteOption | TranslateOption;

/** AIへのリクエスト形式 */
export interface RewriteRequest {
  /** 入力テキスト（最大2000文字） */
  text: string;
  /** 変換モード */
  mode: RewriteMode;
  /** モードに応じたオプション */
  option: ModeOption;
}

/** AIからのレスポンス形式 */
export interface RewriteResponse {
  id: string;
  inputText: string;
  outputText: string;
  mode: RewriteMode;
  option: ModeOption;
  createdAt: string;
}

// --- ユーザー関連 ---

/** 料金プランの種別 */
export type PlanType = "free" | "pro";

/** ユーザー情報 */
export interface User {
  id: string;
  email: string;
  plan: PlanType;
  /** 本日の使用回数 */
  dailyCount: number;
  /** 日次リセット日時 */
  dailyResetAt: string;
  createdAt: string;
}

// --- AI Router関連 ---

/** AIプロバイダの種別 */
export type AIProvider = "groq" | "claude";

/** AI接続設定 */
export interface AIConfig {
  provider: AIProvider;
  model: string;
  maxTokens: number;
}

// --- 定数 ---

/** Freeプランの1日あたりの利用上限回数 */
export const FREE_DAILY_LIMIT = 5;

/** 入力テキストの最大文字数 */
export const MAX_INPUT_LENGTH = 2000;

/** Groq APIの設定（Phase A: 無料） */
export const GROQ_CONFIG: AIConfig = {
  provider: "groq",
  model: "llama-3.3-70b-versatile",
  maxTokens: 2048,
};

/** Claude APIの設定（Phase B: スケール時） */
export const CLAUDE_CONFIG: AIConfig = {
  provider: "claude",
  model: "claude-sonnet-4-6",
  maxTokens: 2048,
};
