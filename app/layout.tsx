import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GP 시뮬레이터",
  description: "GP 적립 시뮬레이션 도구",
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
