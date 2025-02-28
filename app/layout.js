import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vacation Chatbot",
  description: "Llama 3 demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content="Llama 3 demo" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
