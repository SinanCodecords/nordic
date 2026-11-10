import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";
import { CATEGORIES } from "./data";

export function Categories() {
  return (
    <section className="content-width py-14">
      <SectionHeader title="Shop by Category" subtitle="Find exactly what you need." />
      <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="group relative aspect-[236.6/307.2] overflow-hidden border bg-elevated"
          >
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 237px, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="text-lg leading-7 font-semibold tracking-[-0.44px]">{category.title}</h3>
              <p className="mt-0.5 line-clamp-1 text-sm leading-5 tracking-[-0.15px]">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
