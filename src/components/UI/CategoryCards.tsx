import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/core/Icon";
import { If, List } from "@/components/logic";
import type { ICategory } from "@/interfaces";

interface IProps {
  categories: ICategory[];
  activeSlug?: string;
  loading?: boolean;
}

const SCROLL_EDGE_THRESHOLD = 4;

export default function CategoryCards({
  categories,
  activeSlug,
  loading = false,
}: IProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (el == null) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > SCROLL_EDGE_THRESHOLD);
    setCanScrollRight(
      scrollLeft + clientWidth < scrollWidth - SCROLL_EDGE_THRESHOLD,
    );
  }, []);

  const handleScroll = useCallback(
    (direction: "prev" | "next") => {
      const el = scrollRef.current;
      if (el == null) {
        return;
      }

      const card = el.querySelector<HTMLElement>(".category-card");
      const cardWidth = card?.offsetWidth ?? 230;
      const gap = 12;
      const amount = cardWidth + gap;

      el.scrollBy({
        left: direction === "next" ? amount : -amount,
        behavior: "smooth",
      });
    },
    [],
  );

  useEffect(() => {
    updateScrollState();
  }, [categories, loading, updateScrollState]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el == null) {
      return;
    }

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, categories.length, loading]);

  const showNav = !loading && categories.length > 0;

  return (
    <div className="category-cards-section">
      <div className="category-cards-row">
        <div ref={scrollRef} className="category-cards-wrap">
          <div className="category-cards" role="list">
            <If condition={loading}>
              <p className="game-masonry-status">Đang tải danh mục...</p>
            </If>
            <If condition={!loading && categories.length > 0}>
              <List
                items={categories}
                renderItem={(cat) => (
                  <Link
                    href={`/category/${cat.slug}`}
                    role="listitem"
                    className={`category-card category-card--${cat.variant ?? "blue"}${
                      activeSlug === cat.slug ? " category-card--active" : ""
                    }`}
                    aria-current={activeSlug === cat.slug ? "page" : undefined}
                  >
                    <If condition={cat.emoji}>
                      <span className="category-card-icon" aria-hidden>
                        {cat.emoji}
                      </span>
                    </If>
                    <span className="category-card-label">{cat.name}</span>
                  </Link>
                )}
              />
            </If>
          </div>
        </div>

        <If condition={showNav && canScrollLeft}>
          <button
            type="button"
            className="category-cards-nav category-cards-nav--prev"
            aria-label="Xem danh mục trước"
            onClick={() => handleScroll("prev")}
          >
            <IconChevronLeft width={18} height={18} aria-hidden />
          </button>
        </If>
        <If condition={showNav && canScrollRight}>
          <button
            type="button"
            className="category-cards-nav category-cards-nav--next"
            aria-label="Xem danh mục tiếp theo"
            onClick={() => handleScroll("next")}
          >
            <IconChevronRight width={18} height={18} aria-hidden />
          </button>
        </If>
      </div>
    </div>
  );
}
