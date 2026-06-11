import productsData from "@/data/products.json";

export type Product = {
  title: string;
  vendor: string;
  price: number;
  url: string;
  image: string;
  type: string;
  referenceNumber?: string;
  modelFamily?: string;
  movement?: string;
  caseMaterial?: string;
  braceletMaterial?: string;
  dial?: string;
  caseDimension?: string;
  boxAndPapers?: string;
  year?: string;
  condition?: string;
  detailImages?: string[];
};

export function stripProductTitleYear(title: string) {
  return title.replace(/\s*\((?:19|20)\d{2}\)$/, "");
}

export const products = (productsData as Product[]).map((product) => ({
  ...product,
  title: stripProductTitleYear(product.title),
}));

export function getProductHandle(url: string) {
  return url.replace(/\/$/, "").split("/").pop() ?? "";
}

export function normalizeProductHandle(handle: string) {
  return decodeURIComponent(handle)
    .replace(/\/$/, "")
    .replace(/-(?:19|20)\d{2}(?:-\d+)?$/, "");
}

export function getLocalProductHref(url: string) {
  return `/products/${getProductHandle(url)}`;
}

export function findProductByHandle(handle: string) {
  const exactHandle = decodeURIComponent(handle).replace(/\/$/, "");
  const normalizedHandle = normalizeProductHandle(exactHandle);

  return (
    products.find((product) => getProductHandle(product.url) === exactHandle) ??
    products.find((product) => normalizeProductHandle(getProductHandle(product.url)) === normalizedHandle)
  );
}

export function formatProductPrice(price: number) {
  if (!price) {
    return "Price on Request";
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
