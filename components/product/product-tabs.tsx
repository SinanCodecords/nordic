"use client";

import { BadgeCheck, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Stars } from "@/components/shared/stars";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomSelect from "~/form-elements/CustomSelect";
import type { Review } from "@/lib/reviews/types";
import type { ProductDetail } from "./data";
import { ReviewDialog } from "./review-dialog";

const trigger = "px-3 text-muted-foreground data-[state=active]:text-foreground";
const text = "max-w-[672px] type-body leading-[22.75px] text-muted-foreground";

type Props = {
  product: ProductDetail;
  /** Published Judge.me reviews. Empty until Judge.me is set up. */
  reviews: Review[];
  /** Judge.me is set up and this is a real Shopify product. */
  canReview: boolean;
};

export function ProductTabs({ product, reviews, canReview }: Props) {
  return (
    <Tabs defaultValue="description" className="gap-0 pt-12">
      <div className="overflow-x-auto scrollbar-none">
        <TabsList className="h-9 rounded-lg p-1">
          <TabsTrigger value="description" className={trigger}>Description</TabsTrigger>
          <TabsTrigger value="specifications" className={trigger}>Specifications</TabsTrigger>
          <TabsTrigger value="materials" className={trigger}>Materials</TabsTrigger>
          <TabsTrigger value="shipping" className={trigger}>Shipping</TabsTrigger>
          <TabsTrigger value="returns" className={trigger}>Returns</TabsTrigger>
          <TabsTrigger value="reviews" className={trigger}>Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="description" className="pt-6">
        <p className={text}>{product.description}</p>
      </TabsContent>

      <TabsContent value="specifications" className="pt-6">
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full type-body">
            <tbody>
              {product.specifications.map(([label, value]) => (
                <tr key={label} className="h-11 even:bg-transparent odd:bg-elevated">
                  <th scope="row" className="w-1/3 px-4 text-left font-medium sm:w-65">
                    {label}
                  </th>
                  <td className="px-4 text-muted-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="materials" className="pt-6">
        <p className={text}>{product.materials}</p>
      </TabsContent>
      <TabsContent value="shipping" className="pt-6">
        <p className={text}>{product.shipping}</p>
      </TabsContent>
      <TabsContent value="returns" className="pt-6">
        <p className={text}>{product.returns}</p>
      </TabsContent>

      <TabsContent value="reviews" className="pt-6">
        <Reviews product={product} reviews={reviews} canReview={canReview} />
      </TabsContent>
    </Tabs>
  );
}

const SORTS = ["Most Helpful", "Newest", "Highest Rated", "Lowest Rated"] as const;
type Sort = (typeof SORTS)[number];

const newest = (a: Review, b: Review) => b.createdAt.localeCompare(a.createdAt);
const SORTERS: Record<Sort, (a: Review, b: Review) => number> = {
  // Pinned by the store first, then verified buyers, then newest.
  "Most Helpful": (a, b) => Number(b.pinned) - Number(a.pinned) || Number(b.verified) - Number(a.verified) || newest(a, b),
  Newest: newest,
  "Highest Rated": (a, b) => b.rating - a.rating || newest(a, b),
  "Lowest Rated": (a, b) => a.rating - b.rating || newest(a, b),
};

function Reviews({ product, reviews, canReview }: Props) {
  const [sort, setSort] = useState<Sort>("Most Helpful");
  const sorted = useMemo(() => reviews.toSorted(SORTERS[sort]), [reviews, sort]);

  // Real reviews give the live average; otherwise the rating Judge.me saved on the product.
  const count = reviews.length || product.reviewCount;
  const rating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : product.rating;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="h-fit rounded-lg border p-5 lg:w-96 lg:shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-20 shrink-0 text-center">
            <p className="font-heading text-4xl leading-10 font-bold">{rating}</p>
            <div className="flex justify-center pt-1">
              <Stars value={rating} className="size-4 stroke-[1.5]" />
            </div>
            <p className="pt-1 text-xs text-muted-foreground">{count} reviews</p>
          </div>
          <ul className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const n = reviews.filter((r) => r.rating === star).length;
              return (
                <li key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-3 text-center">{star}</span>
                  <Star className="size-3 fill-star text-star" />
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
                    <span
                      className="block h-full rounded-full bg-star"
                      style={{ width: `${reviews.length ? (n / reviews.length) * 100 : 0}%` }}
                    />
                  </span>
                  <span className="w-8 text-right">{n}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <ReviewDialog productId={canReview ? product.id : undefined} productTitle={product.title} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg leading-7 font-semibold tracking-[-0.44px]">
            Customer Reviews <span className="type-body font-normal text-muted-foreground">({reviews.length})</span>
          </h3>
          <CustomSelect
            aria-label="Sort reviews"
            options={[...SORTS]}
            value={sort}
            onValueChange={(v) => setSort(v as Sort)}
            className="w-40"
          />
        </div>
        {sorted.length ? (
          <ul className="mt-4 divide-y rounded-lg border">
            {sorted.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg border p-8 text-center type-body text-muted-foreground">
            No reviews yet. Be the first to write one.
          </p>
        )}
      </div>
    </div>
  );
}

// Fixed time zone so the server and browser print the same date.
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="space-y-2 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Stars value={review.rating} className="size-3.5" />
        <time dateTime={review.createdAt} className="text-xs text-muted-foreground">
          {dateFormat.format(new Date(review.createdAt))}
        </time>
      </div>
      {review.title && <p className="type-label">{review.title}</p>}
      {/* Judge.me sends raw text; React escapes it, so it's safe to show. */}
      <p className="type-body whitespace-pre-line text-muted-foreground">{review.body}</p>
      <p className="flex items-center gap-2 text-xs">
        <span className="font-medium">{review.author}</span>
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <BadgeCheck className="size-3.5" /> Verified buyer
          </span>
        )}
      </p>
    </li>
  );
}
