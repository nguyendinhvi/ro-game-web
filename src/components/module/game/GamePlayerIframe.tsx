import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useGameLike, useGamePlaySession } from "@/hooks";
import {
  IconAdPlay,
  IconFullscreen,
  IconFullscreenExit,
  IconGamepad,
  IconHeart,
  IconSmartphone,
  IconVolume,
  IconVolumeOff,
} from "@/components/core/Icon";
import { Or } from "@/components/logic";
import { getGameUrl } from "@/data/game";
import type { IGame } from "@/interfaces";
import { mergeClass } from "@/utils";

const MOBILE_GAME_MAX_WIDTH = 600;

interface IProps {
  game: IGame;
}

export default function GamePlayerIframe({ game }: IProps) {
  const gameUrl =
    game.iframe_url?.trim() && game.iframe_url.trim().length > 0
      ? game.iframe_url
      : getGameUrl(game.slug);
  const title = game.title;
  const thumbUrl = game.thumbnail?.trim() || game.cover_image?.trim() || "";

  const [showPreGameBanner, setShowPreGameBanner] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuth();
  const { startSession } = useGamePlaySession(game.id, !!user);
  const { isLiked, likesLabel, toggling, toggleLike } = useGameLike(
    game.id,
    game.stats?.likes ?? 0,
    !!user,
  );

  const toggleFullscreen = useCallback(() => {
    const el = gameContainerRef.current;
    if (!el) return;

    if (isMobileView) {
      setIsFullscreen((prev) => !prev);
      return;
    }

    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen?.()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, [isMobileView]);

  const exitMobileFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const isMobileFullscreen = isMobileView && isFullscreen;

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        iframeRef.current?.contentWindow?.postMessage?.(
          { type: "setMute", mute: next },
          "*",
        );
      } catch {
        // cross-origin: game có thể không phản hồi
      }
      return next;
    });
  }, []);

  const handlePlayNow = useCallback(() => {
    setShowPreGameBanner(false);
  }, []);

  const [status, setStatus] = useState<
    "loading" | "playing" | "paused" | "finished" | "loaded"
  >("loading");
  console.log("🚀 ~ status:", status);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_GAME_MAX_WIDTH}px)`,
    );
    const updateViewport = () => setIsMobileView(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (isMobileFullscreen) {
      document.body.classList.add("game-mobile-fullscreen-open");
    } else {
      document.body.classList.remove("game-mobile-fullscreen-open");
    }

    return () => {
      document.body.classList.remove("game-mobile-fullscreen-open");
    };
  }, [isMobileFullscreen]);

  useEffect(() => {
    if (isMobileView) {
      return;
    }

    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [isMobileView]);

  useEffect(() => {
    if (!isMobileFullscreen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        exitMobileFullscreen();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [exitMobileFullscreen, isMobileFullscreen]);

  useEffect(() => {
    if (isMobileView) {
      return;
    }

    setIsFullscreen(false);
  }, [isMobileView]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("🚀 ~ event.data:", event.data);
      const content: {
        action: "loading";
        category: string;
        label: "start" | "complete";
      } = event.data?.content?.data;
      if (content?.category === "game") {
        if (content?.action === "loading") {
          if (content.label === "start") setStatus("loading");
          if (content.label === "complete") setStatus("loaded");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!showPreGameBanner && user) {
      void startSession();
    }
  }, [showPreGameBanner, user, startSession]);

  useEffect(() => {
    setIframeLoaded(false);
    setShowPreGameBanner(true);
  }, [game.slug]);

  useEffect(() => {
    if (!showPreGameBanner || iframeLoaded) return;
    const id = window.setTimeout(() => setIframeLoaded(true), 12000);
    return () => window.clearTimeout(id);
  }, [showPreGameBanner, iframeLoaded]);

  return (
    <div
      className={mergeClass(
        "game-container",
        isMobileFullscreen && "game-container--mobile-fullscreen",
      )}
      ref={gameContainerRef}
    >
      <div
        className={`iframe-wrap${
          showPreGameBanner ? " iframe-wrap--pre-game" : ""
        }`}
      >
        <iframe
          ref={iframeRef}
          src={gameUrl}
          title={title}
          className="iframe"
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
          onLoad={() => setIframeLoaded(true)}
        />
        {showPreGameBanner && (
          <div className="game-play-banner">
            <div className="game-play-banner-head game-play-banner-head--desktop">
              {thumbUrl ? (
                <img
                  className="game-play-banner-thumb game-play-banner-thumb--compact"
                  src={thumbUrl}
                  alt={title}
                  loading="lazy"
                />
              ) : (
                <div
                  className="game-play-banner-thumb game-play-banner-thumb--placeholder game-play-banner-thumb--compact"
                  aria-hidden
                />
              )}
              <h2 className="game-play-banner-title game-play-banner-title--compact">
                {title}
              </h2>
            </div>
            <div className="game-play-banner-inner game-play-banner-inner--with-ad">
              <p className="game-play-banner-ad-label">Quảng cáo</p>

              <div className="game-ad-card game-ad-card--in-banner">
                <div className="game-ad-card-visual" aria-hidden>
                  <IconAdPlay
                    className="game-ad-card-icon"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="game-ad-card-copy">
                  <p className="game-ad-card-brand">Google AdMob™</p>
                  <p className="game-ad-card-desc">
                    Google AdMob™ giúp kiếm doanh thu dễ dàng với quảng cáo
                    trong game di động.
                  </p>
                  <p className="game-ad-card-sponsor">
                    Được tài trợ bởi Google AdMob
                  </p>
                </div>
                <button type="button" className="game-ad-card-more">
                  Tìm hiểu thêm
                </button>
              </div>
              <div className="game-play-banner-actions">
                <button
                  type="button"
                  className="game-play-btn game-play-btn--primary"
                  onClick={handlePlayNow}
                >
                  Chơi ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={mergeClass(
          "game-control-bar",
          isMobileFullscreen && "game-control-bar--mobile-fullscreen",
        )}
      >
        <div className="control-left">
          <div className="control-logo">
            {thumbUrl ? (
              <img
                className="control-logo-img"
                src={thumbUrl}
                alt=""
                aria-hidden
              />
            ) : (
              <span
                className="control-logo-img control-logo-img--placeholder"
                aria-hidden
              />
            )}
          </div>
          <span className="control-title">{title}</span>
        </div>
        <div className="control-right">
          <button
            type="button"
            className={`control-btn control-btn--like${
              isLiked ? " control-btn--liked" : ""
            }`}
            onClick={() => void toggleLike()}
            disabled={toggling}
            title={isLiked ? "Bỏ thích" : "Thích"}
            aria-label={isLiked ? "Bỏ thích" : "Thích"}
            aria-pressed={isLiked}
          >
            <IconHeart
              width={18}
              height={18}
              fill={isLiked ? "currentColor" : "none"}
            />
            <span>{likesLabel}</span>
          </button>
          <button
            type="button"
            className="control-btn control-btn--icon control-btn--aux"
            title="Điều khiển"
            aria-label="Điều khiển"
          >
            <IconGamepad width={18} height={18} />
          </button>
          <button
            type="button"
            className="control-btn control-btn--icon control-btn--aux"
            title="Chế độ di động"
            aria-label="Chế độ di động"
          >
            <IconSmartphone width={18} height={18} />
          </button>
          <button
            type="button"
            className={`control-btn control-btn--icon${
              isMuted ? " control-btn--muted" : ""
            }`}
            onClick={toggleMute}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            <Or
              condition={isMuted}
              true={<IconVolumeOff width={18} height={18} />}
              false={<IconVolume width={18} height={18} />}
            />
          </button>
          <button
            type="button"
            className="control-btn control-btn--icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            <Or
              condition={isFullscreen}
              true={<IconFullscreenExit width={18} height={18} />}
              false={<IconFullscreen width={18} height={18} />}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
