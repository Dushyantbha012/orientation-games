import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classic Logic Puzzles - Challenge Your Mind",
  description: "Play three timeless brain teasers: Mislabeled Jars, Water Jug Problem, and Burning Rope puzzle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
