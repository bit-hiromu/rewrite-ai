import type { NextConfig } from "next";

// packages/shared をトランスパイル対象に含める
// → monorepo内の共通パッケージをNext.jsが正しく処理できるようにする
const nextConfig: NextConfig = {
  transpilePackages: ["@rewrite-ai/shared"],
};

export default nextConfig;
