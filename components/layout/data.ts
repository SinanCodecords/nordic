import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/shared/social-icons";

export const NAV_LINKS = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Shoes", href: "/collections/shoes" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Electronics", href: "/collections/electronics" },
];

// Footer copy is as written in the Figma file (UI-kit placeholder text).
export const FOOTER_COLUMNS = [
  { title: "Product", links: ["Components", "Templates", "Icons", "Theme Generator"] },
  { title: "Company", links: ["About", "Blog", "Changelog", "Pricing"] },
  { title: "Support", links: ["Documentation", "GitHub", "Discord", "Contact"] },
];

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
];
