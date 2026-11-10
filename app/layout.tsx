import type { Metadata } from "next";
import "@/styles/globals.css";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nordic",
  description: "Considered essentials, built to last.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en" className={cn("h-full font-sans antialiased", fontVariables)}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
};

export default RootLayout;
