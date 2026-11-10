import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import { cn } from "@/lib/utils";

// Fonts from the Figma file: Unbounded for display/headings, Geist for body/UI.
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
});
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const fontVariables = cn(geist.variable, unbounded.variable, geistMono.variable);
