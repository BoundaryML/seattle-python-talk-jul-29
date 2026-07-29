"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { slides } from "@/slides";

function clamp(index: number) {
  return Math.max(0, Math.min(index, slides.length - 1));
}

function indexFromHash() {
  if (typeof window === "undefined") return 0;
  const match = window.location.hash.match(/^#\/?(\d+)$/);
  return match ? clamp(Number(match[1]) - 1) : 0;
}

export function Deck() {
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const touchStart = useRef<number | null>(null);
  const ActiveSlide = slides[index].component;
  const meta = slides[index].meta;

  const go = useCallback((nextIndex: number) => {
    const next = clamp(nextIndex);
    setIndex(next);
    setOverview(false);
    window.history.replaceState(null, "", `#${next + 1}`);
  }, []);

  useEffect(() => {
    const syncHash = () => setIndex(indexFromHash());
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key.toLowerCase() === "o") {
        setOverview((value) => !value);
      } else if (event.key.toLowerCase() === "n") {
        setNotes((value) => !value);
      } else if (event.key.toLowerCase() === "f") {
        void document.documentElement.requestFullscreen?.();
      } else if (event.key === "Escape") {
        setOverview(false);
        setNotes(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, index]);

  return (
    <main className={notes ? "deck notes-visible" : "deck"} data-slide-count={`${slides.length} slides`}>
      <section
        className={`slide-canvas tone-${meta.tone ?? "paper"} kind-${meta.kind ?? "content"}`}
        aria-label={`Slide ${index + 1} of ${slides.length}: ${meta.title}`}
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
          if (Math.abs(delta) > 48) go(index + (delta < 0 ? 1 : -1));
          touchStart.current = null;
        }}
      >
        <header className="deck-header">
          <span className="brand-wordmark">BAML</span>
          <span>FFIs but better</span>
          <button type="button" onClick={() => setOverview(true)} aria-label="Open slide overview">overview <kbd>O</kbd></button>
        </header>
        <div className="slide-content"><ActiveSlide /></div>
        <footer className="deck-footer">
          <div className="footer-controls">
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">←</button>
            <button type="button" onClick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="Next slide">→</button>
          </div>
          <div className="progress" aria-hidden="true"><i style={{ width: `${((index + 1) / slides.length) * 100}%` }} /></div>
          <span>{String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
        </footer>
      </section>

      {overview && (
        <div className="overview" role="dialog" aria-modal="true" aria-label="Slide overview">
          <div className="overview-top"><div><span className="brand-wordmark">BAML</span><b>{slides.length} slides</b></div><button type="button" onClick={() => setOverview(false)}>close <kbd>Esc</kbd></button></div>
          <div className="overview-grid">
            {slides.map((slide, slideIndex) => (
              <button className={slideIndex === index ? "current" : ""} type="button" onClick={() => go(slideIndex)} key={`${slideIndex}-${slide.meta.title}`}>
                <span>{String(slideIndex + 1).padStart(2, "0")} · {slide.meta.kind ?? "slide"}</span>
                <b>{slide.meta.title}</b>
                <small>{slide.meta.eyebrow}</small>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
