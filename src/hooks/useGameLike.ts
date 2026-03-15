import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "@/api";

function formatLikeCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(value);
}

export function useGameLike(
  gameId: string,
  initialLikes = 0,
  enabled: boolean,
) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    setLikesCount(initialLikes);
  }, [gameId, initialLikes]);

  useEffect(() => {
    if (!enabled || !gameId) {
      setIsLiked(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void API.gameLike
      .status(gameId)
      .then((status) => {
        if (cancelled) return;
        setIsLiked(status.liked);
        setLikesCount(status.likes_count);
      })
      .catch(() => {
        if (!cancelled) setIsLiked(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, gameId]);

  const toggleLike = useCallback(async () => {
    if (!enabled) {
      void router.push("/login");
      return;
    }

    if (toggling) return;

    setToggling(true);
    try {
      const result = await API.gameLike.toggle(gameId);
      setIsLiked(result.liked);
      setLikesCount(result.likes_count);
    } catch {
      // ignore
    } finally {
      setToggling(false);
    }
  }, [enabled, gameId, router, toggling]);

  return {
    isLiked,
    likesCount,
    likesLabel: formatLikeCount(likesCount),
    loading,
    toggling,
    toggleLike,
  };
}
