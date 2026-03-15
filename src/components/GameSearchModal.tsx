import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import API from "@/api";
import { IconClose } from "@/components/core/Icon";
import GameMasonryCard from "@/components/UI/GameMasonryCard";
import Masonry from "@/components/UI/Masonry";
import { useDebouncedValue } from "@/hooks";
import type { IGame } from "@/interfaces";

interface IProps {
  open: boolean;
  query: string;
  onClose: () => void;
}

type SearchStatus = "idle" | "loading" | "success" | "error";

const SEARCH_DEBOUNCE_MS = 350;
const HEADER_OFFSET_PX = 64;

function getMasonryColumns(width: number): number {
  if (width < 520) return 2;
  if (width < 900) return 3;
  return 4;
}

export default function GameSearchModal({ open, query, onClose }: IProps) {
  const [games, setGames] = useState<IGame[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [columns, setColumns] = useState(4);

  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const updateColumns = () => {
      setColumns(getMasonryColumns(window.innerWidth));
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    if (!open) {
      setGames([]);
      setStatus("idle");
      return;
    }

    if (!debouncedQuery) {
      setGames([]);
      setStatus("idle");
      return;
    }

    let cancelled = false;

    const fetchGames = async () => {
      setStatus("loading");

      try {
        const res = await API.game.getList({
          search: debouncedQuery,
          status: "published",
          limit: 40,
        });

        if (cancelled) {
          return;
        }

        setGames(res.data ?? []);
        setStatus("success");
      } catch {
        if (!cancelled) {
          setGames([]);
          setStatus("error");
        }
      }
    };

    void fetchGames();

    return () => {
      cancelled = true;
    };
  }, [open, debouncedQuery]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const showHint = trimmedQuery.length === 0;
  const showLoading = trimmedQuery.length > 0 && status === "loading";
  const showEmpty =
    trimmedQuery.length > 0 && status === "success" && games.length === 0;
  const showError = trimmedQuery.length > 0 && status === "error";
  const showResults =
    trimmedQuery.length > 0 && status === "success" && games.length > 0;

  return createPortal(
    <>
      <button
        type="button"
        className="game-search-backdrop"
        aria-label="Đóng tìm kiếm"
        onClick={onClose}
      />
      <button
        type="button"
        className="game-search-close"
        aria-label="Đóng tìm kiếm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <IconClose width={20} height={20} aria-hidden />
      </button>
      <div
        className="game-search-panel"
        id="game-search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Kết quả tìm kiếm game"
        style={{ top: HEADER_OFFSET_PX }}
      >
        <div className="game-search-panel-inner">
          {showHint && (
            <p className="game-search-status">
              Nhập tên game để bắt đầu tìm kiếm
            </p>
          )}
          {showLoading && (
            <p className="game-search-status" role="status" aria-live="polite">
              Đang tìm &ldquo;{trimmedQuery}&rdquo;...
            </p>
          )}
          {showEmpty && (
            <p className="game-search-status">
              Không tìm thấy game cho &ldquo;{trimmedQuery}&rdquo;
            </p>
          )}
          {showError && (
            <p className="game-search-status game-search-status--error">
              Không thể tìm kiếm. Vui lòng thử lại.
            </p>
          )}
          {showResults && (
            <Masonry
              columns={columns}
              list={games}
              className="home-game-masonry game-search-masonry"
              columnClassName="home-masonry-column"
              renderItem={(game) => (
                <GameMasonryCard game={game} onNavigate={onClose} />
              )}
            />
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
