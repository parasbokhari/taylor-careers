"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { getVisiblePhotoIndexes } from "@/app/lib/carouselPagination";

export default function LocationImageCarousel({ images = [], label }) {
  const multiple = images.length > 1;
  const [viewportRef, emblaApi] = useEmblaCarousel({ loop: multiple, duration: 20, watchDrag: multiple });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(multiple);
  const [canScrollNext, setCanScrollNext] = useState(multiple);
  const visibleDots = getVisiblePhotoIndexes(images.length, selectedIndex);
  const dotStart = visibleDots[0] ?? 0;

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="location-gallery" role={multiple ? "region" : undefined} aria-roledescription={multiple ? "carousel" : undefined} aria-label={`${label} photos`}
      onKeyDown={(event) => {
        if (!multiple || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "ArrowLeft") emblaApi?.scrollPrev();
        else emblaApi?.scrollNext();
      }}>
      <div className="location-gallery__viewport" ref={viewportRef}>
        <div className="location-gallery__slides">
          {images.length ? images.map((photo, slide) => (
            <div className={`location-gallery__slide${selectedIndex === slide ? " location-gallery__slide--selected" : ""}`}
              aria-hidden={selectedIndex !== slide} key={`${slide}-${photo.src}`}>
              <Image className="location-gallery__photo" src={photo.src} alt={photo.alt || `${label} location`} fill
                sizes="(min-width: 992px) 450px, (min-width: 576px) 540px, 100vw" unoptimized
                loading={slide === 0 ? "eager" : "lazy"} draggable={false} />
            </div>
          )) : (
            <div className="location-gallery__slide location-gallery__slide--selected">
              <div className="location-gallery__placeholder">
                <svg aria-hidden="true" width="96" height="96" viewBox="0 0 96 96" fill="none">
                  <rect x="12" y="12" width="72" height="72" rx="18" stroke="currentColor" strokeWidth="5" />
                  <circle cx="35" cy="34" r="8" fill="currentColor" />
                  <path d="M15 70L38 49L53 62L68 45L82 56V70Q82 82 70 82H26Q15 82 15 70" fill="currentColor" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
      {multiple ? <>
        <div className="location-gallery__controls">
          <button type="button" aria-label="Previous photo" onClick={() => emblaApi?.scrollPrev()} disabled={!canScrollPrev}>
            <Image src="/figma/location-chevron-left.svg" alt="" width={20} height={20} unoptimized />
          </button>
          <div className="location-gallery__dot-window" style={{ "--visible-dots": visibleDots.length }}>
            <div className="location-gallery__dot-track" style={{ transform: `translateX(-${dotStart * 26}px)` }}>
              {images.map((photo, slide) => {
                const visible = slide >= dotStart && slide < dotStart + visibleDots.length;
                return <button type="button" className="location-gallery__dot" aria-label={`Show photo ${slide + 1} of ${images.length}`}
                  aria-current={selectedIndex === slide ? "true" : undefined} aria-hidden={!visible} tabIndex={visible ? 0 : -1}
                  key={`${slide}-${photo.src}`} onClick={() => emblaApi?.scrollTo(slide)}><span /></button>;
              })}
            </div>
          </div>
          <button type="button" aria-label="Next photo" onClick={() => emblaApi?.scrollNext()} disabled={!canScrollNext}>
            <Image src="/figma/location-chevron-right.svg" alt="" width={20} height={20} unoptimized />
          </button>
        </div>
        <span className="visually-hidden" aria-live="polite" aria-atomic="true">Photo {selectedIndex + 1} of {images.length}</span>
      </> : null}
    </div>
  );
}
