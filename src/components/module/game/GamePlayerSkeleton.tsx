const SKELETON_ICON_BTN_COUNT = 4;

export default function GamePlayerSkeleton() {
  return (
    <div
      className="game-container game-container--skeleton"
      aria-busy="true"
      aria-label="Đang tải game"
    >
      <div className="iframe-wrap game-player-skeleton__iframe-wrap">
        <div className="game-player-skeleton__iframe" aria-hidden />
      </div>
      <div className="game-control-bar game-player-skeleton__control-bar">
        <div className="control-left">
          <span className="game-player-skeleton__logo" aria-hidden />
          <span className="game-player-skeleton__title" aria-hidden />
        </div>
        <div className="control-right">
          <span
            className="game-player-skeleton__btn game-player-skeleton__btn--like"
            aria-hidden
          />
          {Array.from({ length: SKELETON_ICON_BTN_COUNT }, (_, index) => (
            <span
              key={index}
              className="game-player-skeleton__btn game-player-skeleton__btn--icon"
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  );
}
