import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SB-Chat - Green Scout AI検索条件拡張ツール",
  description: "Green専用のダイレクトスカウト検索条件拡張ツール。AIが最適な拡張提案でより多くの候補者を発見します。",
  keywords: ["Green", "ダイレクトスカウト", "AI", "検索条件", "採用"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}