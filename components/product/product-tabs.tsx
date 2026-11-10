"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import { Stars } from "@/components/shared/stars";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomSelect from "~/form-elements/CustomSelect";
import type { ProductDetail } from "./data";

const trigger = "px-3 text-muted-foreground data-[state=active]:text-foreground";
const text = "max-w-[672px] type-body leading-[22.75px] text-muted-foreground";

// Reviews aren't stored in Shopify itself; they come from a reviews app (Judge.me, Shopify Product Reviews…).
// Until one is connected the list is empty, like the Figma design.
const REVIEWS: { rating: number }[] = [];

export function ProductTabs({ product }: { product: ProductDetail }) {
  return (
    <Tabs defaultValue="description" className="gap-0 pt-12">
      <div className="overflow-x-auto [scrollbar-width:none]">
        <TabsList className="h-9 rounded-lg p-1">
          <TabsTrigger value="description" className={trigger}>Description</TabsTrigger>
          <TabsTrigger value="specifications" className={trigger}>Specifications</TabsTrigger>
          <TabsTrigger value="materials" className={trigger}>Materials</TabsTrigger>
          <TabsTrigger value="shipping" className={trigger}>Shipping</TabsTrigger>
          <TabsTrigger value="returns" className={trigger}>Returns</TabsTrigger>
          <TabsTrigger value="reviews" className={trigger}>Reviews ({REVIEWS.length})</TabsTrigger>
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
                  <th scope="row" className="w-1/3 px-4 text-left font-medium sm:w-[260px]">
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
        <Reviews rating={product.rating} count={product.reviewCount} />
      </TabsContent>
    </Tabs>
  );
}

function Reviews({ rating, count }: { rating: number; count: number }) {
  const writeReview = () => toast("Reviews aren't connected yet.");

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
              const n = REVIEWS.filter((r) => r.rating === star).length;
              return (
                <li key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-3 text-center">{star}</span>
                  <Star className="size-3 fill-star text-star" />
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
                    <span
                      className="block h-full rounded-full bg-star"
                      style={{ width: `${REVIEWS.length ? (n / REVIEWS.length) * 100 : 0}%` }}
                    />
                  </span>
                  <span className="w-8 text-right">{n}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <Button className="mt-5 w-full" onClick={writeReview}>
          Write a Review
        </Button>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg leading-7 font-semibold tracking-[-0.44px]">
            Customer Reviews <span className="type-body font-normal text-muted-foreground">({REVIEWS.length})</span>
          </h3>
          <CustomSelect
            aria-label="Sort reviews"
            options={["Most Helpful", "Newest", "Highest Rated", "Lowest Rated"]}
            defaultValue="Most Helpful"
            className="w-40"
          />
        </div>
        <p className="mt-4 rounded-lg border p-8 text-center type-body text-muted-foreground">
          No reviews yet. Be the first to write one.
        </p>
      </div>
    </div>
  );
}
