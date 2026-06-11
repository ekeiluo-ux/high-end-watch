import type { Metadata } from "next";
import Link from "next/link";
import { brandsMenu, footerColumns, primaryNavigation, topBarItems } from "@/data/site-data";
import styles from "./page.module.scss";

const introParagraphs = [
  "Feel free to add us on WhatsApp: +447942866158.",
  "If you have a specific watch in mind, just send us a picture or the name, and we will provide you with detailed images of our high-end clone quality, ensuring you can assess their authenticity and quality.",
];

const detailSections = [
  {
    eyebrow: "Selecting Products",
    title: "Selecting Products:",
    paragraphs: introParagraphs,
  },
  {
    eyebrow: "Ordering Process",
    title: "Ordering Process:",
    paragraphs: [
      "When you are clear about placing an order, Confirm with us and make the payment. We accept various payment methods. After payment is confirmed, we will arrange for the delivery of your product to your address.",
    ],
  },
  {
    eyebrow: "Logistics Updates",
    title: "Logistics Updates:",
    paragraphs: [
      "We will keep you informed of the logistics status daily via WhatsApp, Let you know in real time where your watch is currently being shipped to.",
    ],
  },
  {
    eyebrow: "Returns and Exchanges",
    title: "Returns and Exchanges:",
    paragraphs: [
      "We do not offer free or unconditional returns or exchanges. So please take a video of the entire unboxing process when you receive the express delivery. If the watch is found to be broken, we will replace it free of charge, including free shipping.",
      "Apart from this, for personal reasons such as not liking the style, not liking the intricate details, not liking the color, and not liking the size, we do not provide return or exchange services. You may choose to return the watch to us at your own expense, After we verify that there are no issues, we will refund you.",
    ],
  },
] as const;

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

export const metadata: Metadata = {
  title: "About Us | HIGH-END WATCH",
  description: "About HIGH-END WATCH",
};

export default function AboutPage() {
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
                              <Link
                                key={item}
                                href={{
                                  pathname: "/",
                                  query: { search: item },
                                }}
                                className={styles.brandMenuItem}
                              >
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

      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroFrame}>
            <p className={styles.heroEyebrow}>About</p>
            <h1>Our Story</h1>
            <p>
              We will recommend watch grades based on your specific needs and the occasion for wearing. The price of
              watches depending on their brand and grade. We are committed to promoting high-end clone quality. -
              Logistics can be delivered to all parts of the world🌍. And it&apos;s free shipping.
            </p>
          </div>
        </div>
      </section>

      {detailSections.map((section) => (
        <section key={section.title} className={styles.storySection}>
          <div className={styles.container}>
            <div className={styles.storyGrid}>
              <div className={styles.sectionHeading}>
                <p>{section.eyebrow}</p>
                <h2>{section.title}</h2>
              </div>
              <div className={styles.storyCopy}>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className={styles.socialSection}>
        <div className={styles.container}>
          <div className={styles.socialCard}>
            <p>TikTok</p>
            <a
              href="https://www.tiktok.com/@vincentdeng82/video/7644251567234780437?_r=1&u_code=f2j94j6mbgfjk8&preview_pb=0&sharer_language=en&_d=el2me02l2ahhij&share_item_id=7644251567234780437&source=h5_m&timestamp=1781063934&item_author_type=1&utm_source=whatsapp&share_enter_from=personal_homepage&tt_from=whatsapp&enable_checksum=1&utm_medium=ios&share_link_id=BF3C3CE5-4A6F-4922-9C7A-BE066FD454E7&user_id=7622859618192917525&sec_user_id=MS4wLjABAAAAUTR3SLYRLeLViJiAbjIp4e5yKVVEjsEt0ZVKCdhC-srm2HVy28ZMnfqg-bWdm1b6&utm_campaign=client_share&panel_source_v2=share_panel&ug_btm=b8727,b2878&social_share_type=0&link_reflow_popup_iteration_sharer=%7B%22follow_to_play_duration%22:-1,%22click_empty_to_play%22:1,%22profile_clickable%22:1,%22dynamic_cover%22:1%7D&share_app_id=1233&sp_root_share_link_id=BF3C3CE5-4A6F-4922-9C7A-BE066FD454E7&sp_root_d=el2me02l2ahhij&sp_level=1&sp_root_u=f2j94j6mbgfjk8"
              target="_blank"
              rel="noreferrer"
              className={styles.socialHandle}
            >
              @Millionaire Wrist
            </a>
            <span>FOLLOW US ON TIKTOK</span>
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
