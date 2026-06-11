import type { Product } from "@/lib/products";

const PROPERTY_VALUE_PATTERN =
  /"@type"\s*:\s*"PropertyValue"\s*,\s*"name"\s*:\s*"([^"]+)"\s*,\s*"value"\s*:\s*"([^"]*)"/g;
const SPEC_ROW_PATTERN =
  /<div class="label">\s*([^<]+?)\s*<\/div>\s*<div class="specs-meta">\s*([^<]+?)\s*<\/div>/g;

type DetailFieldKey =
  | "referenceNumber"
  | "modelFamily"
  | "movement"
  | "caseMaterial"
  | "braceletMaterial"
  | "dial"
  | "caseDimension"
  | "boxAndPapers"
  | "year"
  | "condition";

const FIELD_LABEL_MAP: Record<string, DetailFieldKey> = {
  "Reference Number": "referenceNumber",
  "Model Family": "modelFamily",
  Movement: "movement",
  "Case Material": "caseMaterial",
  "Bracelet Material": "braceletMaterial",
  Dial: "dial",
  "Dial Color": "dial",
  "Case Dimension": "caseDimension",
  "Case Size": "caseDimension",
  "Box & Papers": "boxAndPapers",
  Year: "year",
  Condition: "condition",
};

type RemoteProductJson = {
  product: {
    body_html?: string;
    images?: Array<{ src?: string | null }>;
  };
};

function normalizeText(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html: string) {
  return normalizeText(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  );
}

function buildSpecsFromHtml(html: string) {
  const specs: Partial<Record<DetailFieldKey, string>> = {};

  for (const match of html.matchAll(PROPERTY_VALUE_PATTERN)) {
    const fieldKey = FIELD_LABEL_MAP[normalizeText(match[1])];
    if (fieldKey && !specs[fieldKey]) {
      specs[fieldKey] = normalizeText(match[2]);
    }
  }

  for (const match of html.matchAll(SPEC_ROW_PATTERN)) {
    const fieldKey = FIELD_LABEL_MAP[normalizeText(match[1])];
    if (fieldKey && !specs[fieldKey]) {
      specs[fieldKey] = normalizeText(match[2]);
    }
  }

  return specs;
}

function buildOverview(product: Product) {
  const details = [
    product.caseMaterial ? `crafted in ${product.caseMaterial.toLowerCase()}` : "",
    product.caseDimension ? `with a ${product.caseDimension} case` : "",
    product.dial ? `a ${product.dial.toLowerCase()} dial` : "",
    product.braceletMaterial ? `and ${product.braceletMaterial.toLowerCase()}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const movement = product.movement ? ` Powered by a ${product.movement.toLowerCase()} movement.` : "";

  if (!details) {
    return `${product.title} is part of our curated luxury watch collection.${movement}`;
  }

  return `${product.title} is ${details}.${movement}`.replace(", and", " and");
}

function buildLearnMore(product: Product) {
  const lines = [
    product.referenceNumber ? `Reference ${product.referenceNumber} anchors this listing in the ${product.modelFamily || "brand"} family.` : "",
    product.caseMaterial ? `The case is presented in ${product.caseMaterial.toLowerCase()} for a refined luxury finish.` : "",
    product.dial ? `Its ${product.dial.toLowerCase()} dial keeps the display clean and immediately legible.` : "",
    product.braceletMaterial ? `The watch is paired with ${product.braceletMaterial.toLowerCase()} to continue the piece's overall character.` : "",
    product.boxAndPapers ? `It is offered with ${product.boxAndPapers.toLowerCase()}.` : "",
  ].filter(Boolean);

  return lines.join(" ");
}

export async function fetchRemoteProductDetails(product: Product) {
  const handle = product.url.replace(/\/$/, "").split("/").pop();
  if (!handle) {
    return {
      ...product,
      detailImages: product.detailImages ?? [product.image].filter(Boolean),
      overview: buildOverview(product),
      learnMore: buildLearnMore(product),
    };
  }

  try {
    const [htmlResponse, jsonResponse] = await Promise.all([
      fetch(product.url, {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; HIGH-END-WATCH/1.0)",
        },
        next: { revalidate: 3600 },
      }),
      fetch(`https://wristaficionado.com/products/${handle}.json`, {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; HIGH-END-WATCH/1.0)",
        },
        next: { revalidate: 3600 },
      }),
    ]);

    const html = htmlResponse.ok ? await htmlResponse.text() : "";
    const json = jsonResponse.ok ? ((await jsonResponse.json()) as RemoteProductJson) : null;
    const specs = html ? buildSpecsFromHtml(html) : {};
    const detailImages =
      json?.product.images
        ?.map((image) => image?.src || "")
        .filter(Boolean) ?? (product.detailImages ?? [product.image].filter(Boolean));

    const bodyHtml = json?.product.body_html ?? "";
    const overview = stripHtml(bodyHtml) || buildOverview({ ...product, ...specs });

    return {
      ...product,
      ...specs,
      detailImages,
      overview,
      learnMore: buildLearnMore({ ...product, ...specs }),
    };
  } catch {
    return {
      ...product,
      detailImages: product.detailImages ?? [product.image].filter(Boolean),
      overview: buildOverview(product),
      learnMore: buildLearnMore(product),
    };
  }
}
