"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./page.module.scss";

type ProductGalleryProps = {
  title: string;
  images: string[];
};

export default function ProductGallery({ title, images }: ProductGalleryProps) {
  const galleryImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!galleryImages.length) {
    return null;
  }

  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  };

  return (
    <div className={styles.galleryColumn}>
      <div className={styles.galleryViewer}>
        <button
          type="button"
          className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
          onClick={goToPrevious}
          aria-label="Previous product image"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.galleryArrowIcon}>
            <path d="M14.5 5.5L8 12l6.5 6.5" />
          </svg>
        </button>

        <div className={styles.galleryStage}>
          <Image
            src={activeImage}
            alt={`${title} image ${activeIndex + 1}`}
            width={1200}
            height={1200}
            className={styles.galleryImage}
            priority
          />
        </div>

        <button
          type="button"
          className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
          onClick={goToNext}
          aria-label="Next product image"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.galleryArrowIcon}>
            <path d="M9.5 5.5L16 12l-6.5 6.5" />
          </svg>
        </button>
      </div>

      {galleryImages.length > 1 ? (
        <div className={styles.galleryThumbRow}>
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`${styles.galleryThumb} ${index === activeIndex ? styles.galleryThumbActive : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                width={180}
                height={180}
                className={styles.galleryThumbImage}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
