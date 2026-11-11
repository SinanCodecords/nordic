import { FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPolicy, storefrontEnabled } from "@/lib/shopify/policies";
import { POLICIES, type PolicyHandle, policyHref } from "@/lib/store-info";
import { cn } from "@/lib/utils";
import CustomBreadcrumb from "~/CustomBreadcrumb";

type Props = PageProps<"/policies/[handle]">;

async function findPolicy(params: Props["params"]) {
  const { handle } = await params;
  const policy = POLICIES.find((p) => p.handle === handle);
  if (!policy) notFound();
  return policy;
}

export function generateStaticParams() {
  return POLICIES.map(({ handle }) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await findPolicy(params)).label };
}

export default function PolicyPage({ params }: Props) {
  return (
    <div className="content-width pt-9 pb-24">
      <Suspense fallback={<PolicySkeleton />}>
        <Policy params={params} />
      </Suspense>
    </div>
  );
}

async function Policy({ params }: Pick<Props, "params">) {
  const { handle, label } = await findPolicy(params);
  const policy = storefrontEnabled ? await getPolicy(handle).catch(() => null) : null;

  return (
    <>
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label, isCurrentPage: true }]}
        currentClassName="font-medium"
      />
      <div className="grid gap-10 pt-6 lg:grid-cols-[220px_1fr]">
        <PolicyNav current={handle} />
        <article className="min-w-0 max-w-[720px]">
          <h1 className="type-page-title">{policy?.title ?? label}</h1>
          {policy ? (
            <div
              className={cn(
                "pt-6 type-body leading-[24px] text-muted-foreground",
                "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
                "[&_h2]:pt-6 [&_h2]:pb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground",
                "[&_h3]:pt-4 [&_h3]:pb-1 [&_h3]:font-semibold [&_h3]:text-foreground",
                "[&_li]:pt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:pt-3 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5",
              )}
              // Written by the store in Shopify admin, not by shoppers.
              dangerouslySetInnerHTML={{ __html: policy.body }}
            />
          ) : (
            <NotPublished />
          )}
        </article>
      </div>
    </>
  );
}

function PolicyNav({ current }: { current: PolicyHandle }) {
  return (
    <nav aria-label="Policies">
      <ul className="flex flex-wrap gap-1 lg:flex-col">
        {POLICIES.map(({ handle, label }) => (
          <li key={handle} className="shrink-0">
            <Link
              href={policyHref(handle)}
              aria-current={handle === current ? "page" : undefined}
              className={cn(
                "flex h-9 items-center rounded-md px-3 type-label text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                handle === current && "bg-elevated text-foreground",
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Until Shopify is connected (or the store writes this policy), say where it comes from. */
function NotPublished() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-lg border px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-elevated">
        <FileText className="size-7 stroke-[1.5] text-muted-foreground" />
      </span>
      <p className="pt-4 type-label">This policy hasn&apos;t been published yet</p>
      <p className="max-w-sm pt-1 type-body text-muted-foreground">
        It will appear here once it&apos;s added in Shopify. Questions in the meantime?{" "}
        <Link href="/contact" className="text-foreground underline underline-offset-4">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}

function PolicySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-64 w-full max-w-[720px]" />
    </div>
  );
}
