"use client";

import { Star } from "lucide-react";
import { startTransition, useActionState, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import CustomInput from "~/form-elements/CustomInput";
import CustomTextArea from "~/form-elements/CustomTextArea";
import SubmitButton from "~/form-elements/SubmitButton";
import { type ReviewActionResult, writeReview } from "./review-actions";

/** "Write a Review" button. Without a Shopify product and Judge.me it only says reviews aren't connected. */
export function ReviewDialog({ productId, productTitle }: { productId?: string; productTitle: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const [, formAction, pending] = useActionState(async (prev: ReviewActionResult, form: FormData) => {
    const result = await writeReview(prev, form);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Thanks for your review! It will show here once it's approved.");
      setOpen(false);
      setRating(0);
    }
    return result;
  }, {});

  if (!productId) {
    return (
      <Button className="mt-5 w-full" onClick={() => toast("Reviews aren't connected yet.")}>
        Write a Review
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-5 w-full">Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>{productTitle}</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          // Not `action={…}`: React clears the form after an action, which would lose the text on an error.
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            startTransition(() => formAction(data));
          }}
        >
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="rating" value={rating || ""} />

          <fieldset>
            <legend className="type-label">Your rating</legend>
            <div className="flex gap-1 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  aria-pressed={rating === star}
                  onClick={() => setRating(star)}
                  className="rounded-sm p-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Star
                    className={cn(
                      "size-6 stroke-[1.5]",
                      star <= rating ? "fill-star text-star" : "text-[#e4e4e7] dark:text-border",
                    )}
                  />
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomInput label="Name" name="name" autoComplete="name" required />
            <CustomInput label="Email" name="email" type="email" autoComplete="email" required />
          </div>
          <CustomInput label="Title" name="title" placeholder="Sum it up in a few words" />
          <CustomTextArea label="Review" name="body" rows={4} required placeholder="What did you like or dislike?" />

          <SubmitButton isLoading={pending} className="w-full">
            Submit Review
          </SubmitButton>
          <p className="text-center text-xs text-muted-foreground">Your email is never shown publicly.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
