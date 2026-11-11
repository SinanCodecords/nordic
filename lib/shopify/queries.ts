import { imageFragment, productFragment } from "./fragments";

export const getProductsQuery = /* GraphQL */ `
  query getProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${productFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 50) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            ...ImageFields
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getCartQuantityQuery = /* GraphQL */ `
  query getCartQuantity($id: ID!) {
    cart(id: $id) {
      totalQuantity
    }
  }
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFields
    }
  }
  ${productFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductHandlesQuery = /* GraphQL */ `
  query getProductHandles($first: Int!) {
    products(first: $first) {
      nodes {
        handle
      }
    }
  }
`;

/** Separate from the product query: it needs the "product inventory" API permission, and stock changes more often. */
export const getProductStockQuery = /* GraphQL */ `
  query getProductStock($handle: String!) {
    product(handle: $handle) {
      variants(first: 100) {
        nodes {
          id
          quantityAvailable
        }
      }
    }
  }
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      handle
      title
      description
      seo {
        title
        description
      }
      products(first: $first) {
        nodes {
          ...ProductFields
        }
      }
    }
  }
  ${productFragment}
`;
