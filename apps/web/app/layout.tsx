import type { Metadata } from "next";
import "./globals.css";

// ページのメタ情報（タブのタイトルや検索エンジン向け情報）
export const metadata: Metadata = {
  title: "RewriteAI - AI文章リライト・翻訳ツール",
  description: "AIを活用して文章をリライト・トーン変換・翻訳するツール",
};

// RootLayout: すべてのページを包むルートレイアウト
// children にはそれぞれのページコンポーネントが入る
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
