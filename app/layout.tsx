import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bible Study Platform",
  description: "Understand Scripture. Remember what you learn. Live it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
