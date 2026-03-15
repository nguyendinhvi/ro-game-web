"use client";

import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { If, List, Or } from "@/components/logic";
import type { IGame } from "@/interfaces";
import { mergeClass } from "@/utils";

const isValidImageUrl = (s: string | undefined): s is string =>
  typeof s === "string" &&
  s.trim().length > 0 &&
  (s.startsWith("http://") || s.startsWith("https://"));

const AUTO_SLIDE_MS = 4000;

const resolveBgImage = (game: IGame): string | undefined => {
  if (isValidImageUrl(game.cover_image)) return game.cover_image;
  if (isValidImageUrl(game.thumbnail)) return game.thumbnail;
  return undefined;
};

interface IProps {
  games: IGame[];
}

const HeroBanner = ({ games }: IProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const router = useRouter();

  const total = games.length;
  const current = total > 0 ? games[currentIndex % total] : null;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (total > 0 ? (prev + 1) % total : 0));
  }, [total]);

  const goToGame = () => {
    if (current) router.push(`/game/${current.slug}`);
  };

  const selectSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (total <= 1 || paused) return;
    const id = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(id);
  }, [total, paused, next]);

  if (total === 0 || current == null) return null;

  const game = current;
  const bgImage = resolveBgImage(game);

  return (
    <section
      className="hero-banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={goToGame}
      onKeyDown={(e) => e.key === "Enter" && goToGame()}
      role="button"
      tabIndex={0}
      aria-label={`Chơi ${game.title}`}
    >
      <div
        className="hero-banner-bg"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        }}
      />
      <div className="hero-banner-overlay" aria-hidden />
      <div className="hero-banner-inner">
        <div className="hero-banner-content">
          <h2 className="hero-banner-title">{game.title}</h2>
          <p className="hero-banner-subtitle">{game.slug}</p>
          <div className="hero-banner-meta">
            <If condition={game.stats?.rating != null}>
              <span className="hero-banner-meta-tag hero-banner-meta-rating">
                Rating: {game.stats?.rating}
              </span>
            </If>
            <If condition={game.tags?.length > 0}>
              <span className="hero-banner-meta-tag">
                {game.tags.slice(0, 2).join(", ")}
              </span>
            </If>
          </div>
          <List
            items={game.tags?.slice(0, 4)}
            className="hero-banner-tags"
            renderItem={(tag) => <span className="hero-banner-tag">{tag}</span>}
          />
          <p className="hero-banner-desc">{game.description}</p>
        </div>
        <div
          className="hero-banner-thumbs"
          onClick={(e) => e.stopPropagation()}
        >
          <List
            items={games}
            renderItem={(item, i) => (
              <button
                type="button"
                className={mergeClass(
                  "hero-banner-thumb",
                  i === currentIndex && "hero-banner-thumb-active",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  selectSlide(i);
                }}
                aria-label={`Xem slide ${i + 1}`}
              >
                <Or
                  condition={isValidImageUrl(item.thumbnail)}
                  true={
                    <div
                      className="hero-banner-thumb-img"
                      style={{
                        backgroundImage: `url(${item.thumbnail})`,
                      }}
                    />
                  }
                  false={<div className="hero-banner-thumb-placeholder" />}
                />
              </button>
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
