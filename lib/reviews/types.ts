export type Review = {
  id: number;
  rating: number;
  title: string;
  body: string;
  author: string;
  /** Bought the product (Judge.me "verified buyer"). */
  verified: boolean;
  /** Pinned by the store, shown first under "Most Helpful". */
  pinned: boolean;
  createdAt: string;
};
