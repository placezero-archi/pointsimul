import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "포인트 시뮬레이터",
  description: "포인트 적립 시뮬레이션 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
