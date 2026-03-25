import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "NutriAI - Trợ lý dinh dưỡng thông minh",
  description: "Ứng dụng theo dõi calo và gợi ý bữa ăn bằng AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.variable} font-[family-name:var(--font-be-vietnam)] bg-slate-50 text-secondary antialiased`}>
        {children}
      </body>
    </html>
  );
}