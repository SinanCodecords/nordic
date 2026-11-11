import { policyHref } from "@/lib/store-info";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/shared/social-icons";

export const NAV_LINKS = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Shoes", href: "/collections/shoes" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Electronics", href: "/collections/electronics" },
];

export const FOOTER_COLUMNS = [
  { title: "Shop", links: NAV_LINKS },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping", href: policyHref("shipping-policy") },
      { label: "Returns & Refunds", href: policyHref("refund-policy") },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "My Account", href: "/account" },
      { label: "Privacy Policy", href: policyHref("privacy-policy") },
      { label: "Terms of Service", href: policyHref("terms-of-service") },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
];
