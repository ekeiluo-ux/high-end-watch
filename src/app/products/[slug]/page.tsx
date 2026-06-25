import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brandsMenu, footerColumns, primaryNavigation, topBarItems } from "@/data/site-data";
import { fetchRemoteProductDetails } from "@/lib/product-detail";
import { findProductByHandle } from "@/lib/products";
import ProductGallery from "./ProductGallery";
import styles from "./page.module.scss";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type PricingMark = "check" | "dash" | "99%" | "100%";

const infoCards = [
  {
    title: "Transaction Introduction",
    lines: [
      "We will recommend watch grades based on your specific needs and the occasion for wearing.",
      "The price of watches depending on their brand and grade.",
      "We are committed to promoting high-end clone quality.",
      "Logistics can be delivered to all parts of the world🌍.",
      "And it's free shipping.",
    ],
  },
  {
    title: "Selecting Products",
    lines: [
      "Feel free to add us on WhatsApp: +447942866158.",
      "If you have a specific watch in mind, just send us a picture or the name,",
      "and we will provide you with detailed images of our high-end clone quality,",
      "ensuring you can assess their authenticity and quality.",
    ],
  },
  {
    title: "Ordering Process",
    lines: [
      "When you are clear about placing an order,",
      "Confirm with us and make the payment.",
      "We accept various payment methods.",
      "After payment is confirmed, we will arrange for the delivery of your product to your address.",
    ],
  },
] as const;

function getBrandHref(brand: string) {
  return {
    pathname: "/",
    query: { search: brand },
  };
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductByHandle(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} | HIGH-END WATCH`,
    description: `${product.vendor} ${product.title}`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = findProductByHandle(slug);

  if (!product) {
    notFound();
  }

  const detailProduct = await fetchRemoteProductDetails(product);
  const galleryImages = detailProduct.detailImages?.length
    ? detailProduct.detailImages
    : [detailProduct.image].filter(Boolean);
  const specItems = [
    { label: "Reference Number", value: detailProduct.referenceNumber },
    { label: "Model Family", value: detailProduct.modelFamily },
    { label: "Case Material", value: detailProduct.caseMaterial },
    { label: "Bracelet Material", value: detailProduct.braceletMaterial },
    { label: "Dial", value: detailProduct.dial },
    { label: "Case Dimension", value: detailProduct.caseDimension },
    { label: "Box & Papers", value: detailProduct.boxAndPapers },
  ].filter((item) => item.value);
  const pricingPlans = [
    {
      title: "Level A",
      description: "At this level, it's basically obvious at a glance that it is a FAKE. Apart from the resemblance in style, many details are not accurately replicated.",
      price: "--",
      note: "We don't sell this level",
      noteWarning: true,
      buttonText: "WE DON'T SELL",
      buttonDisabled: true,
      features: [
        { label: "Brand New", status: "check" },
        { label: "Free Shipping", status: "check" },
        { label: "Intact Box", status: "cross" },
        { label: "Certificate Description", status: "cross" },
        { label: "Detail Restoration", status: "cross" },
        { label: "Concierge Service", status: "cross" },
      ],
      theme: "light",
    },
    {
      title: "Level A+",
      description: "Equipped with all necessary accessories, it boasts an exquisite appearance with a 99% degree of detail reproduction. It can be worn as a daily choice.",
      price: "$ 700",
      note: "Add it to Shopping Cart and Order",
      buttonText: "ADD TO SHOPPING CART",
      buttonPrimary: true,
      features: [
        { label: "Brand New", status: "check" },
        { label: "Free Shipping", status: "check" },
        { label: "Intact Box", status: "check" },
        { label: "Certificate Description", status: "check" },
        { label: "Detail Restoration (99%)", status: "check" },
        { label: "Concierge Service", status: "cross" },
      ],
      theme: "muted",
    },
    {
      title: "1:1 High-End",
      description: "1:1 High-End Clone, with impeccable details and complete accessories. If dissatisfied, customers can communicate for returns or exchanges.",
      price: "$$$",
      note: "Contact and place an order via WhatsApp",
      buttonText: "CONTACT VIA WHATSAPP",
      buttonInverted: true,
      buttonLink: "https://wa.me/447942866158",
      features: [
        { label: "Brand New", status: "check-circle" },
        { label: "Free Shipping", status: "check-circle" },
        { label: "Intact Box", status: "check-circle" },
        { label: "Certificate Description", status: "check-circle" },
        { label: "Detail Restoration (99%)", status: "check-circle" },
        { label: "Concierge Service", status: "check-circle" },
      ],
      theme: "dark",
    }
  ];

  function renderFeatureIcon(status: string) {
     if (status === "check") {
       return (
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <circle cx="12" cy="12" r="12" fill="#111" />
           <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
       );
     }
    if (status === "cross") {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#E5E5E5" />
          <path d="M16 8L8 16M8 8L16 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (status === "check-circle") {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#fff" />
          <path d="M17 8L10 15L7 12" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return null;
  }

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

      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerRow}`}>
          <Link href="/" className={styles.logoBlock}>
            <span className={styles.logoEyebrow}>Wrist Aficionado</span>
            <span className={styles.logoWordmark}>Luxury Watches</span>
          </Link>
          <Link href="/" className={styles.backLink}>
            Back to Collection
          </Link>
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
                              <Link key={item} href={getBrandHref(item)} className={styles.brandMenuItem}>
                                {item}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.navDropdown}>
                      {group.items.map((item) =>
                        item === "About us" ? (
                          <Link key={item} href="/about">
                            {item}
                          </Link>
                        ) : (
                          <Link key={item} href="/">
                            {item}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <section className={styles.breadcrumbSection}>
        <div className={styles.container}>
          <p className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/">Men&apos;s Watches</Link>
            <span>/</span>
            <span>{detailProduct.title}</span>
          </p>
        </div>
      </section>

      <section className={styles.productSection}>
        <div className={`${styles.container} ${styles.productGrid}`}>
          <ProductGallery title={detailProduct.title} images={galleryImages} />

          <aside className={styles.summaryColumn}>
            <p className={styles.vendor}>{detailProduct.vendor}</p>
            <h1>{detailProduct.title}</h1>

            {specItems.length ? (
              <div className={styles.specList} aria-label="Product specifications">
                {specItems.map((item) => (
                  <div key={item.label} className={styles.specListRow}>
                    <span className={styles.specListLabel}>{item.label}</span>
                    <span className={styles.specListValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Prices</h2>
          <section className={styles.pricingModule} aria-label="Pricing levels">
            <div className={styles.pricingGrid}>
              {pricingPlans.map((plan) => (
                <div key={plan.title} className={`${styles.pricingPanel} ${styles[`pricingPanel_${plan.theme}`]}`}>
                  <h3 className={styles.pricingTitle}>{plan.title}</h3>
                  <p className={styles.pricingDescription}>{plan.description}</p>
                  <div className={styles.pricingDivider} />
                  <div className={styles.pricingPrice}>{plan.price}</div>
                  <p className={`${styles.pricingNote} ${plan.noteWarning ? styles.pricingNoteWarning : ""}`}>
                    {plan.note}
                  </p>
                  {plan.buttonLink ? (
                    <a href={plan.buttonLink} target="_blank" rel="noreferrer" className={styles.pricingButton}>
                      {plan.buttonText}
                    </a>
                  ) : (
                    <button type="button" className={styles.pricingButton} disabled={plan.buttonDisabled}>
                      {plan.buttonText}
                    </button>
                  )}
                  <div className={styles.pricingFeatures}>
                    {plan.features.map((feature) => (
                      <div key={feature.label} className={styles.pricingFeatureRow}>
                        <span className={styles.pricingFeatureIcon}>{renderFeatureIcon(feature.status)}</span>
                        <span className={styles.pricingFeatureLabel}>{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <h2 className={styles.sectionTitle}>Services Provided</h2>
          <div className={styles.serviceGrid}>
            {infoCards.map((card) => (
              <article key={card.title} className={styles.serviceCard}>
                <h2>{card.title}</h2>
                <div className={styles.serviceContent}>
                  {card.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
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
