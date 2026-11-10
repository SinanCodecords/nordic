import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, YoutubeIcon } from "@/components/shared/social-icons";

// Positions are taken from the 1440 × 1010 Figma frame and scale with the viewport on desktop.
// The lime background, model and dark blur are invariant across light and dark themes.
export function Hero() {
  return (
    <section data-lime-hero className="relative -mt-[69px] overflow-hidden bg-background pt-[69px] text-[#171717] lg:h-[1010px]">
      <div className="absolute inset-0 bg-lime lg:[clip-path:polygon(0_0,61.7%_0,95.4%_100%,0_100%)]" />
      <BlurShape />

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col lg:pt-24 lg:pb-[54px]">
        <div className="relative z-10 content-width flex flex-1 flex-col pt-12 lg:pt-0">
          <h1 className="font-heading text-[clamp(2.5rem,7vw,6.3rem)] leading-[1.05] font-bold tracking-[-2px] uppercase">
            Considered
            <br />
            essentials,
            <br />
            built to last.
          </h1>

          <div className="mt-8 flex gap-5 lg:mt-[60px] lg:flex-col">
            <SocialLink href="https://instagram.com" label="Instagram" icon={InstagramIcon} />
            <SocialLink href="https://youtube.com" label="YouTube" icon={YoutubeIcon} />
          </div>

          <div className="mt-10 max-w-[462px] space-y-3.5 lg:mt-auto">
            <p className="font-sans text-xl leading-normal font-medium opacity-85">
              Street styles that stand out. Be bold. Be different.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/collections/new-arrivals"
                className="inline-flex h-[53px] items-center bg-hero-cta px-8 font-heading text-sm leading-none font-bold text-brand uppercase transition-opacity hover:opacity-90"
              >
                Shop now
              </Link>
              <Link
                href="/collections/all"
                className="inline-flex h-[53px] items-center border-2 border-[#e5e5e5] px-8 font-heading text-sm leading-none font-bold uppercase transition-colors hover:bg-white/30"
              >
                Explore collection
              </Link>
            </div>
          </div>
        </div>

        <Image
          src="/images/hero/model.png"
          alt="Model wearing a lime Nordic hoodie and white sunglasses"
          width={614}
          height={941}
          priority
          sizes="(min-width: 1024px) 43vw, 80vw"
          className="relative z-20 mx-auto mt-8 w-4/5 max-w-sm lg:absolute lg:top-[88px] lg:left-[53.4%] lg:mt-0 lg:w-[42.6%] lg:max-w-none"
        />
      </div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="hover:opacity-70">
      <Icon className="size-[30px] stroke-[1.5]" />
    </a>
  );
}

// Soft dark shadow behind the model ("Vector 8087" in Figma, blurred 200px at 90% opacity).
function BlurShape() {
  return (
    <svg
      viewBox="0 0 353 1049"
      aria-hidden="true"
      className="pointer-events-none absolute top-[31px] left-[48.4%] hidden h-[1049px] w-[24.5%] opacity-90 blur-[100px] lg:block"
      preserveAspectRatio="none"
    >
      <path d="M287 103 353 0 174 989 0 1049V552l43-225 177-153z" fill="#171717" />
    </svg>
  );
}
