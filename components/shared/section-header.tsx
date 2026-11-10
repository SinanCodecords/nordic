import { ArrowRight } from "lucide-react";
import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
};

export function SectionHeader({ title, subtitle, viewAllHref }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 pb-4">
      <div className="space-y-2.5">
        <h2 className="font-heading text-2xl leading-none font-bold tracking-[-0.5px]">{title}</h2>
        {subtitle && <p className="text-lg leading-tight text-muted-foreground">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex shrink-0 items-center gap-1 font-heading text-sm leading-none font-medium hover:underline"
        >
          View all <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
