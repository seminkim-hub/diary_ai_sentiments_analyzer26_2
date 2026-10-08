import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diary AI Sentiments Analyzer",
  description: "오늘의 마음을 기록하고 다정하게 돌아보는 감성 일기",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
