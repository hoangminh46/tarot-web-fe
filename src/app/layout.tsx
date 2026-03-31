import type { Metadata } from "next";
import {
  Cinzel_Decorative,
  Cinzel,
  Philosopher,
  EB_Garamond,
} from "next/font/google";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tarot Huyền Bí — Nhìn xuyên màn đêm, khám phá vận mệnh",
  description:
    "Trải bài Tarot huyền bí chuyên sâu. Khám phá tình yêu, sự nghiệp, tài chính và vận mệnh qua 78 lá bài Tarot cổ xưa. Miễn phí, chính xác, bí ẩn.",
  keywords: [
    "tarot",
    "tarot online",
    "tarot huyền bí",
    "tarot tình yêu",
    "tarot sự nghiệp",
    "luận giải tarot",
    "bói bài tarot",
    "tarot miễn phí",
    "tarot AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${cinzelDecorative.variable} ${cinzel.variable} ${philosopher.variable} ${ebGaramond.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
