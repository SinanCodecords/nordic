export const imageFragment = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const productFragment = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    vendor
    description
    descriptionHtml
    productType
    tags
    availableForSale
    featuredImage {
      ...ImageFields
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFields
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
      optionValues {
        name
        swatch {
          color
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    # Extra details typed in Shopify admin (Settings → Custom data), plus Judge.me's star rating.
    metafields(
      identifiers: [
        { namespace: "custom", key: "highlights" }
        { namespace: "custom", key: "specifications" }
        { namespace: "custom", key: "materials" }
        { namespace: "reviews", key: "rating" }
        { namespace: "reviews", key: "rating_count" }
      ]
    ) {
      namespace
      key
      value
    }
  }
  ${imageFragment}
`;
