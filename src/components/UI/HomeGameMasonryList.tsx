import Masonry from "./Masonry";
import GameMasonryCard from "./GameMasonryCard";
import { If } from "@/components/logic";
import type { IGame } from "@/interfaces";

interface IProps {
  games: IGame[];
  columns: number;
  loadingMore: boolean;
  isFull: boolean;
}

export default function HomeGameMasonryList({
  games,
  columns,
  loadingMore,
  isFull,
}: IProps) {
  return (
    <>
      <Masonry
        columns={columns}
        list={games}
        className="home-game-masonry"
        columnClassName="home-masonry-column"
        renderItem={(game) => <GameMasonryCard game={game} />}
      />
      <If condition={loadingMore || !isFull}>
        <div className="game-masonry-sentinel" aria-hidden={!loadingMore}>
          <If condition={loadingMore}>
            <div
              className="game-masonry-load-more"
              role="status"
              aria-live="polite"
              aria-label="Đang tải thêm game"
            >
              <span className="game-masonry-spinner" aria-hidden />
              <span className="game-masonry-load-more-text">
                Đang tải thêm...
              </span>
            </div>
          </If>
        </div>
      </If>
    </>
  );
}
