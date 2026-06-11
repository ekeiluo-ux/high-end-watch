"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  brandsMenu,
  footerColumns,
  heroContent,
  primaryNavigation,
  topBarItems,
} from "@/data/site-data";
import { getLocalProductHref, products } from "@/lib/products";
import styles from "./page.module.scss";
const visibleStep = 12;

const sortOptions = [
  { label: "Date: New to Old", value: "featured" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Price: Low to High", value: "price-asc" },
] as const;

const brandSearchMap: Record<string, string> = {
  OMEGA: "Omega",
};

function getFamilyLabel(title: string) {
  if (title.includes("Royal Oak Offshore")) return "Royal Oak Offshore";
  if (title.includes("Royal Oak")) return "Royal Oak";
  if (title.includes("GMT-Master II")) return "GMT-Master II";
  if (title.includes("Submariner")) return "Submariner";
  if (title.includes("Nautilus")) return "Nautilus";
  if (title.includes("RM")) return "RM";
  return "Collector Selection";
}

function getFooterHref(item: string) {
  if (item === "About Us") {
    return "/about";
  }

  if (item === "Men's Watches") {
    return "/";
  }

  if (["Patek Philippe Nautilus", "Rolex Daytona", "Audemars Piguet Royal Oak"].includes(item)) {
    return {
      pathname: "/",
      query: { search: item },
    };
  }

  return "/";
}

export default function Home() {
  return (
    <Suspense fallback={<main className={styles.page} />}>
      <HomeWithSearchParams />
    </Suspense>
  );
}

function HomeWithSearchParams() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") ?? "";

  return <HomeContent key={searchParam} initialSearch={searchParam} />;
}

function HomeContent({ initialSearch }: { initialSearch: string }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("featured");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(visibleStep);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const sortControlRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 16) {
        setIsHeaderHidden(false);
      } else if (delta > 6 && currentScrollY > 140) {
        setIsHeaderHidden(true);
      } else if (delta < -6) {
        setIsHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!sortControlRef.current?.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSortMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const nextProducts = products.filter((product) => {
      const family = getFamilyLabel(product.title);
      if (!query) {
        return true;
      }

      return [product.title, product.vendor, family]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    if (sortBy === "price-desc") {
      return [...nextProducts].sort((a, b) => (b.price || Number.MAX_SAFE_INTEGER) - (a.price || Number.MAX_SAFE_INTEGER));
    }

    if (sortBy === "price-asc") {
      return [...nextProducts].sort((a, b) => {
        const aPrice = a.price || Number.MAX_SAFE_INTEGER;
        const bPrice = b.price || Number.MAX_SAFE_INTEGER;
        return aPrice - bPrice;
      });
    }

    return nextProducts;
  }, [searchQuery, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const activeSortOption = sortOptions.find((option) => option.value === sortBy) ?? sortOptions[0];

  const applyBrandSearch = (brand: string) => {
    setSearchQuery(brandSearchMap[brand] ?? brand);
    setVisibleCount(visibleStep);
  };

  const resetHomeState = () => {
    setSearchQuery("");
    setSortBy("featured");
    setViewMode("grid");
    setVisibleCount(visibleStep);
    setIsSortMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <main className={styles.page}>
      <section className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarRow}>
            {topBarItems.map((item) => (
              <span key={item} className={styles.topBarText}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <header className={`${styles.header} ${isHeaderHidden ? styles.headerHidden : ""}`}>
        <div className={`${styles.container} ${styles.headerRow}`}>
          <Link href="/" className={styles.logoBlock} onClick={resetHomeState}>
            <span className={styles.logoEyebrow}>Wrist Aficionado</span>
            <span className={styles.logoWordmark}>Luxury Watches</span>
          </Link>
          <form className={styles.headerSearch} onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setVisibleCount(visibleStep);
              }}
              placeholder="Search our store"
              aria-label="Search men's watches"
            />
          </form>
        </div>
        <nav className={styles.nav}>
          <div className={styles.container}>
            <ul className={styles.navList}>
              {primaryNavigation.map((group) => (
                <li key={group.label} className={styles.navItem}>
                  <button type="button">{group.label}</button>
                  {group.label === "BRANDS" ? (
                    <div className={`${styles.navDropdown} ${styles.brandsDropdown}`}>
                      <div className={styles.brandColumns}>
                        {brandsMenu.columns.map((column, index) => (
                          <div key={`${group.label}-${index}`} className={styles.brandColumn}>
                            {column.map((item) => (
                              <button
                                key={item}
                                type="button"
                                className={styles.brandMenuItem}
                                onClick={() => applyBrandSearch(item)}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.navDropdown}>
                      {group.items.map((item) => (
                        item === "About us" ? (
                          <Link key={item} href="/about">
                            {item}
                          </Link>
                        ) : (
                          <a key={item} href="#">
                            {item}
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.heroEyebrow}>{heroContent.eyebrow}</p>
          <div className={styles.heroGrid}>
            <h1>{heroContent.title}</h1>
            <p>{heroContent.description}</p>
          </div>
        </div>
      </section>

      <section className={styles.collectionSection}>
        <div className={`${styles.container} ${styles.collectionLayout}`}>
          <div className={styles.collectionContent}>
            <div className={styles.toolbar}>
              <div className={styles.viewSwitch}>
                <button
                  type="button"
                  className={viewMode === "grid" ? styles.activeView : ""}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <span className={styles.gridIcon} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={viewMode === "list" ? styles.activeView : ""}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  title="List view"
                >
                  <span className={styles.listIcon} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.toolbarCount}>{filteredProducts.length} products</p>
              <div className={styles.sortControl} ref={sortControlRef}>
                <button
                  type="button"
                  className={styles.sortTrigger}
                  aria-haspopup="listbox"
                  aria-expanded={isSortMenuOpen}
                  aria-label="Sort products"
                  onClick={() => setIsSortMenuOpen((open) => !open)}
                >
                  <span className={styles.sortTriggerLabel}>{activeSortOption.label}</span>
                  <span
                    className={`${styles.sortChevron} ${isSortMenuOpen ? styles.sortChevronOpen : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {isSortMenuOpen ? (
                  <div className={styles.sortMenu} role="listbox" aria-label="Sort products">
                    <div className={styles.sortMenuNotch} aria-hidden="true" />
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={sortBy === option.value}
                        className={`${styles.sortOption} ${sortBy === option.value ? styles.sortOptionActive : ""}`}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortMenuOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className={viewMode === "grid" ? styles.productGrid : styles.productList}>
              {visibleProducts.map((product) => (
                <article key={product.url || `${product.vendor}-${product.title}`} className={styles.productCard}>
                  <Link href={getLocalProductHref(product.url)}>
                    <div className={styles.imageWrap}>
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={900}
                        height={1100}
                        className={styles.productImage}
                      />
                    </div>
                    <div className={styles.productBody}>
                      <p className={styles.productVendor}>{product.vendor}</p>
                      <h2>{product.title}</h2>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {visibleCount < filteredProducts.length ? (
              <div className={styles.loadMoreWrap}>
                <button type="button" onClick={() => setVisibleCount((count) => count + visibleStep)}>
                  Load more
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerTop}`}>
          <div className={styles.footerMenuGroup}>
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.items.map((item) => (
                    <li key={item}>
                      {item === "Whatsapp: +44 7942 866 158" ? (
                        <span>{item}</span>
                      ) : item === "proxvape.com" ? (
                        <a href="https://proxvape.com" target="_blank" rel="noreferrer">
                          {item}
                        </a>
                      ) : item === "About Us" ? (
                        <Link href="/about">{item}</Link>
                      ) : (
                        <Link href={getFooterHref(item)}>{item}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={styles.subscribeCard}>
            <div className={styles.footerLogoMark} aria-hidden="true">
              <div className={styles.footerLogoOuter}>
                <div className={styles.footerLogoInner}>
                  <span>HW</span>
                </div>
              </div>
            </div>
            <h3>HIGH-END WATCH</h3>
          </div>
        </div>
        <div className={`${styles.container} ${styles.footerBottom}`}>
          <p>&copy; 2026 HIGH-END WATCH. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
