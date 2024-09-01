import { Nunito } from "next/font/google";
import "./globals.css";

import toast, { Toaster } from "react-hot-toast";
import Template from "./teamplate";
const nunito = Nunito({
  subsets: ["cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" data-rh="true" />
      </head>
      <body className={nunito.className}>
        <Template>{children}</Template>
      </body>
    </html>
  );
}
