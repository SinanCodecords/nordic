import type { Metadata } from "next";
import { AccountNav } from "@/components/account/account-nav";
import CustomBreadcrumb from "~/CustomBreadcrumb";

export const metadata: Metadata = {
  title: { template: "%s · My Account", default: "My Account" },
  robots: { index: false },
};

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="content-width pt-9 pb-24">
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "My Account", isCurrentPage: true }]}
        currentClassName="font-medium"
      />
      <h1 className="pt-4 type-page-title">My Account</h1>
      <div className="flex flex-col gap-6 pt-6 lg:flex-row">
        <AccountNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
