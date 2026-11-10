import { imageFragment } from "./fragments";

const cartFragment = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    discountCodes { code applicable }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { ...ImageFields }
            product { handle title featuredImage { ...ImageFields } }
          }
        }
      }
    }
  }
  ${imageFragment}
`;

const errors = "userErrors { message }";

export const getCartQuery = /* GraphQL */ `
  query getCart($id: ID!) { cart(id: $id) { ...CartFields } }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($input: CartInput!) {
    cartCreate(input: $input) { cart { ...CartFields } ${errors} }
  }
  ${cartFragment}
`;

export const addLinesMutation = /* GraphQL */ `
  mutation addLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } ${errors} }
  }
  ${cartFragment}
`;

export const updateLinesMutation = /* GraphQL */ `
  mutation updateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } ${errors} }
  }
  ${cartFragment}
`;

export const discountCodesMutation = /* GraphQL */ `
  mutation discountCodes($cartId: ID!, $codes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $codes) { cart { ...CartFields } ${errors} }
  }
  ${cartFragment}
`;

export const buyerIdentityMutation = /* GraphQL */ `
  mutation buyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) { cart { ...CartFields } ${errors} }
  }
  ${cartFragment}
`;
