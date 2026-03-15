import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import GameMasonryThumb from "@/components/UI/GameMasonryThumb";
import { Or } from "@/components/logic";
import type { IGame } from "@/interfaces";
import { mergeClass } from "@/utils";

interface GameMasonryCardProps {
  game: IGame;
  onNavigate?: () => void;
}

export default function GameMasonryCard({
  game,
  onNavigate,
}: GameMasonryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoActive, setVideoActive] = useState(false);

  const thumbUrl = game.thumbnail || game.cover_image;
  const previewVideoUrl = game.preview_video_url?.trim() ?? "";

  const handleMouseEnter = useCallback(() => {
    if (!previewVideoUrl) return;

    const video = videoRef.current;
    if (!video) return;

    setVideoActive(true);
    video.currentTime = 0;
    void video.play().catch(() => setVideoActive(false));
  }, [previewVideoUrl]);

  const handleMouseLeave = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setVideoActive(false);
  }, []);

  return (
    <div className="game-masonry-card-wrap">
      <Link
        href={`/game/${game.slug}`}
        className="game-masonry-card"
        onClick={onNavigate}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={mergeClass(
            "game-masonry-card-media",
            videoActive && "game-masonry-card-media--video-active",
          )}
        >
          <Or
            condition={!!thumbUrl}
            true={
              <GameMasonryThumb
                src={thumbUrl}
                alt={game.title}
                orientation={game.orientation}
              />
            }
            false={
              <div
                className="game-masonry-thumb game-masonry-thumb--placeholder"
                aria-hidden
              />
            }
          />
          {previewVideoUrl && (
            <video
              ref={videoRef}
              className={`game-masonry-preview-video${
                videoActive ? " game-masonry-preview-video--active" : ""
              }`}
              src={previewVideoUrl}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
            />
          )}
        </div>
        <span className="game-masonry-card-overlay">
          <span className="game-masonry-card-title">{game.title}</span>
        </span>
      </Link>
    </div>
  );
}
