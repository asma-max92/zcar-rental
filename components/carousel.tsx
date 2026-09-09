"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  gap?: number;
}

export function Carousel({
  children,
  itemsPerView = 3,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  gap = 24,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  // Measure item width + gap, update on resize
  useEffect(() => {
    function measure() {
      const first = trackRef.current?.firstElementChild;
      if (first) {
        setStep(first.clientWidth + gap);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children, gap]);

  // Clamp currentIndex when maxIndex shrinks
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const paginate = useCallback(
    (newDirection: number) => {
      setCurrentIndex((prev) => {
        const next = prev + newDirection;
        if (next < 0) return maxIndex;
        if (next > maxIndex) return 0;
        return next;
      });
    },
    [maxIndex]
  );

  useEffect(() => {
    if (!autoPlay || totalItems <= itemsPerView) return;
    const timer = setInterval(() => paginate(1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, paginate, totalItems, itemsPerView]);

  const goTo = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className="relative">
      {/* Track */}
      <div className="overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex"
          animate={{
            x: -(currentIndex * step),
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{ gap }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: `calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})` }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Arrows */}
      {showArrows && totalItems > itemsPerView && (
        <>
          <button
            onClick={() => paginate(-1)}
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full border border-ink-border bg-ink-card flex items-center justify-center transition-all ${
              canGoPrev
                ? "hover:border-gold/50 hover:bg-ink-light text-apple-black"
                : "opacity-30 cursor-not-allowed text-apple-gray"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => paginate(1)}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full border border-ink-border bg-ink-card flex items-center justify-center transition-all ${
              canGoNext
                ? "hover:border-gold/50 hover:bg-ink-light text-apple-black"
                : "opacity-30 cursor-not-allowed text-apple-gray"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && totalItems > itemsPerView && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "w-8 bg-gold"
                  : "w-2 bg-ink-border hover:bg-apple-gray/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
