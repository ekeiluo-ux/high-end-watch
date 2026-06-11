from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "source.html"
OUTPUT = ROOT / "products-extracted.json"


def decode(value: str) -> str:
    return value.replace("\\/", "/").replace('\\"', '"')


def main() -> None:
    html = SOURCE.read_text(encoding="utf-8")
    pattern = re.compile(
        r'\\"price\\":\{\\"amount\\":(?P<price>[0-9.]+),\\"currencyCode\\":\\"USD\\"\},'
        r'\\"product\\":\{\\"title\\":\\"(?P<title>.*?)\\",\\"vendor\\":\\"(?P<vendor>.*?)\\",'
        r'\\"id\\":\\".*?\\",\\"untranslatedTitle\\":\\".*?\\",\\"url\\":\\"(?P<url>.*?)\\",'
        r'\\"type\\":\\"(?P<type>.*?)\\"\},\\"id\\":\\".*?\\",\\"image\\":\{\\"src\\":\\"(?P<image>.*?)\\"\}',
        re.S,
    )

    items = []
    for match in pattern.finditer(html):
        image = decode(match.group("image"))
        url = decode(match.group("url"))

        if image.startswith("//"):
            image = f"https:{image}"
        elif image.startswith("/"):
            image = f"https://wristaficionado.com{image}"

        if url.startswith("/"):
            url = f"https://wristaficionado.com{url}"

        items.append(
            {
                "title": decode(match.group("title")),
                "vendor": decode(match.group("vendor")),
                "price": float(match.group("price")),
                "url": url,
                "image": image,
                "type": decode(match.group("type")),
            }
        )

    OUTPUT.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"extracted {len(items)} products")
    print(json.dumps(items[:6], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
