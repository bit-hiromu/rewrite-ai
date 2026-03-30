import type { Config } from "tailwindcss";

// Tailwindが適用するファイルの範囲を指定
// contentに含まれていないファイルのクラスは本番ビルドで削除される
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
