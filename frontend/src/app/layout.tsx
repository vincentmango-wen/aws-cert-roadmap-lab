import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWS資格ロードマップラボ",
  description:
    "AWS Cloud Practitioner / Solutions Architect Associate を学ぶ初学者向けのAWS資格学習サイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}