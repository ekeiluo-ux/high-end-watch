from __future__ import annotations

import json
import re
import time
from html import unescape
from pathlib import Path
from typing import Any

import requests


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "src" / "data" / "products.json"
CACHE_PATH = ROOT / "data-extracts" / "enriched-products-cache.json"

FIELD_KEYS = {
    "referenceNumber": "",
    "modelFamily": "",
    "movement": "",
    "caseMaterial": "",
    "braceletMaterial": "",
    "dial": "",
    "caseDimension": "",
    "boxAndPapers": "",
}

FIELD_MAP = {
    "Reference Number": "referenceNumber",
    "Model Family": "modelFamily",
    "Movement": "movement",
    "Case Material": "caseMaterial",
    "Bracelet Material": "braceletMaterial",
    "Dial": "dial",
    "Dial Color": "dial",
    "Case Dimension": "caseDimension",
    "Case Size": "caseDimension",
    "Box & Papers": "boxAndPapers",
}

PROPERTY_VALUE_PATTERN = re.compile(
    r'"@type"\s*:\s*"PropertyValue"\s*,\s*"name"\s*:\s*"([^"]+)"\s*,\s*"value"\s*:\s*"([^"]*)"',
    re.S,
)
SPEC_ROW_PATTERN = re.compile(
    r'<div class="label">\s*([^<]+?)\s*</div>\s*<div class="specs-meta">\s*([^<]+?)\s*</div>',
    re.S,
)


def fetch_text(url: str, expect_json: bool = False) -> Any:
    last_error: Exception | None = None
    for attempt in range(6):
        try:
            response = requests.get(
                url,
                timeout=30,
                headers={
                    "User-Agent": "Mozilla/5.0 (compatible; WatchDataBot/1.0)",
                    "Accept-Language": "en-US,en;q=0.9",
                },
            )
            response.raise_for_status()
            return response.json() if expect_json else response.text
        except Exception as error:  # noqa: BLE001
            last_error = error
            wait_seconds = min(20, 2 * (attempt + 1))
            print(f"retry {attempt + 1} for {url} after {wait_seconds}s: {error}")
            time.sleep(wait_seconds)
    raise RuntimeError(f"Failed to fetch {url}") from last_error


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value)).strip()


def fetch_product_details(product: dict[str, Any]) -> dict[str, Any]:
    url = product["url"]
    handle = url.rstrip("/").rsplit("/", 1)[-1]

    html = fetch_text(url)
    json_payload = fetch_text(f"https://wristaficionado.com/products/{handle}.json", expect_json=True)["product"]

    extracted = dict(FIELD_KEYS)

    for raw_name, raw_value in PROPERTY_VALUE_PATTERN.findall(html):
        field_key = FIELD_MAP.get(normalize_text(raw_name))
        if field_key and not extracted[field_key]:
            extracted[field_key] = normalize_text(raw_value)

    for raw_name, raw_value in SPEC_ROW_PATTERN.findall(html):
        field_key = FIELD_MAP.get(normalize_text(raw_name))
        if field_key and not extracted[field_key]:
            extracted[field_key] = normalize_text(raw_value)

    detail_images = [
        image.get("src", "")
        for image in json_payload.get("images", [])
        if isinstance(image, dict) and image.get("src")
    ]

    enriched = dict(product)
    enriched.update(extracted)
    enriched["detailImages"] = detail_images

    if not enriched.get("image") and detail_images:
        enriched["image"] = detail_images[0]

    return enriched


def main() -> None:
    products = json.loads(PRODUCTS_PATH.read_text(encoding="utf-8"))
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    cache = json.loads(CACHE_PATH.read_text(encoding="utf-8")) if CACHE_PATH.exists() else {}
    enriched_products: list[dict[str, Any]] = []

    started_at = time.time()
    for index, product in enumerate(products, start=1):
        if product["url"] in cache:
            enriched = cache[product["url"]]
        else:
            enriched = fetch_product_details(product)
            cache[product["url"]] = enriched
            time.sleep(0.35)

        enriched_products.append(enriched)

        if index % 10 == 0 or index == len(products):
            CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            elapsed = time.time() - started_at
            print(f"processed {index}/{len(products)} in {elapsed:.1f}s")

    PRODUCTS_PATH.write_text(
        json.dumps(enriched_products, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"saved {len(enriched_products)} enriched products to {PRODUCTS_PATH}")


if __name__ == "__main__":
    main()
