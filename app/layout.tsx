import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@/styles/globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nordic",
  description: "Considered essentials, built to last.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full font-sans antialiased", fontVariables)}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
