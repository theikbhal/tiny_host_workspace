import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SimplHost - The simplest way to host & share your web project",
  description: "SimplHost - The simplest way to host & share your web project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
