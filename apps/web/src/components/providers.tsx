"use client";

import { SignetProvider } from "@shakibdshy/signet-auth-react";

import { Toaster } from "@signet-auth-example/ui/components/sonner";

import { signetClient } from "@/lib/signet-client";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <SignetProvider client={signetClient}>
        {children}
        <Toaster richColors position="bottom-right" />
      </SignetProvider>
    </ThemeProvider>
  );
}
