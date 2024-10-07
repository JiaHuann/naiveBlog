import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import MyNavBar from "@/components/navbar";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MyNavBar/>
        <div style={{ backgroundImage: "url('/background.jpg')",backgroundRepeat: "no-repeat",backgroundSize: "cover" }}>
          {children}
        </div>
        
        <Analytics />
      </body>
    </html>
  );
}
