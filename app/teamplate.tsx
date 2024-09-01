"use client";

import toast, { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader />
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
    </>
  );
}
