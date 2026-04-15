import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/SessionProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ConnecTable — Never Eat Alone at UW-Madison",
  description:
    "Join a table of 3-4 students around a vibe or topic. AI-powered matching, real dining halls, real connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased">
        <SessionProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 500,
                border: "1px solid #e7e5e4",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
          />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
