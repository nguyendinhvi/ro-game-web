import { useEffect, useMemo, useRef, useState } from "react";
import type { GameOrientation } from "@/interfaces";
import { mergeClass } from "@/utils";
import { parseThumbDimensions } from "@/utils/parseThumbDimensions";

interface GameMasonryThumbProps {
  src: string;
  alt: string;
  orientation?: GameOrientation;
}

export default function GameMasonryThumb({
  src,
  alt,
  orientation = "landscape",
}: GameMasonryThumbProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const { width, height } = useMemo(
    () => parseThumbDimensions(src, orientation),
    [src, orientation],
  );

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  if (error) {
    return (
      <div
        className="game-masonry-thumb game-masonry-thumb--placeholder"
        style={{ aspectRatio: `${width} / ${height}` }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className="game-masonry-thumb-wrap"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {!loaded && <div className="game-masonry-thumb-skeleton" aria-hidden />}
      <img
        ref={imgRef}
        className={mergeClass(
          "game-masonry-thumb",
          loaded && "game-masonry-thumb--loaded",
        )}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
