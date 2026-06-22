import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Masonry, GameMasonryCard, SEO } from "@/components";
import AdBanner from "@/components/AdBanner";
import TopNav from "@/components/UI/TopNav";
import API from "@/api";
import { useFetch } from "@/hooks";
import { GamePlayerIframe, GamePlayerSkeleton } from "@/components/module";

function getRelatedMasonryColumns(width: number): number {
  if (width < 400) return 2;
  if (width < 580) return 3;
  if (width < 780) return 4;
  if (width < 980) return 5;
  return 6;
}

function formatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(value);
}

function orientationLabel(orientation: string): string {
  return orientation === "portrait" ? "Dọc (điện thoại)" : "Ngang";
}

export default function GamePage() {
  const router = useRouter();
  const key = typeof router.query.key === "string" ? router.query.key : "";
  const isReady = router.isReady && key.length > 0;

  const {
    data: game,
    status,
    error,
  } = useFetch(() => API.game.getBySlug(key), [key], isReady);

  const { data: relatedGames = [], status: relatedStatus } = useFetch(
    () => API.game.getRelated(key, 18),
    [key],
    isReady,
  );

  const relatedMasonryRef = useRef<HTMLElement>(null);
  const [relatedMasonryColumns, setRelatedMasonryColumns] = useState(4);

  useEffect(() => {
    const el = relatedMasonryRef.current;
    if (el == null) {
      return;
    }

    const update = () => {
      setRelatedMasonryColumns(
        getRelatedMasonryColumns(el.getBoundingClientRect().width),
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const title = game?.title ?? "Game";
  const description =
    game?.description?.trim() || `Chơi ${title} online miễn phí trên RO Game.`;
  const ogImage = game?.thumbnail?.trim() || game?.cover_image?.trim();

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={ogImage}
        canonical={`/game/${key}`}
        type="article"
      />
      <div className="game">
        <div className="layout">
          <TopNav />
          <div className="body">
            <div className="body-row">
              <main className="main">
                {status === "loading" && <GamePlayerSkeleton />}
                {status === "error" && (
                  <p className="game-fetch-status game-fetch-status--error">
                    Không tìm thấy game: {String(error)}
                  </p>
                )}
                {status === "success" && game && (
                  <GamePlayerIframe game={game} />
                )}

                <AdBanner variant="horizontal" className="game-main-ad" />

                {game?.description && (
                  <section className="game-description" aria-label="Mô tả game">
                    <h2 className="game-section-title">Giới thiệu</h2>
                    <p className="game-description-text">{game.description}</p>
                  </section>
                )}

                {game && (
                  <div className="game-meta">
                  {game.developer?.name && (
                    <p>
                      <span className="meta-label">Nhà phát triển:</span>{" "}
                      {game.developer.website ? (
                        <a
                          className="meta-value meta-link"
                          href={game.developer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {game.developer.name}
                        </a>
                      ) : (
                        <span className="meta-value">{game.developer.name}</span>
                      )}
                    </p>
                  )}
                  {game.stats?.rating > 0 && (
                    <p>
                      <span className="meta-label">Xếp hạng:</span>{" "}
                      <span className="meta-value">
                        {game.stats.rating.toFixed(1)}
                        {game.stats.rating_count > 0 &&
                          ` (${formatCount(game.stats.rating_count)} lượt)`}
                      </span>
                    </p>
                  )}
                  {game.stats?.plays > 0 && (
                    <p>
                      <span className="meta-label">Lượt chơi:</span>{" "}
                      <span className="meta-value">
                        {formatCount(game.stats.plays)}
                      </span>
                    </p>
                  )}
                  {game.stats?.likes > 0 && (
                    <p>
                      <span className="meta-label">Lượt thích:</span>{" "}
                      <span className="meta-value">
                        {formatCount(game.stats.likes)}
                      </span>
                    </p>
                  )}
                  {game.created_at && (
                    <p>
                      <span className="meta-label">Phát hành:</span>{" "}
                      <span className="meta-value">
                        {new Date(game.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </p>
                  )}
                  {game.updated_at && (
                    <p>
                      <span className="meta-label">Cập nhật mới nhất:</span>{" "}
                      <span className="meta-value">
                        {new Date(game.updated_at).toLocaleDateString("vi-VN")}
                      </span>
                    </p>
                  )}
                  <p>
                    <span className="meta-label">Hướng màn hình:</span>{" "}
                    <span className="meta-value">
                      {orientationLabel(game.orientation)}
                    </span>
                  </p>
                  <p>
                    <span className="meta-label">Công nghệ:</span>{" "}
                    <span className="meta-value">HTML5</span>
                  </p>
                  <p>
                    <span className="meta-label">Nền tảng:</span>{" "}
                    <span className="meta-value">
                      Trình duyệt (máy tính, điện thoại, máy tính bảng)
                    </span>
                  </p>
                </div>
              )}

              {game?.tags && game.tags.length > 0 && (
                <div className="tags">
                  {game.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {game && (
                <nav className="game-breadcrumbs" aria-label="Breadcrumb">
                  <Link href="/">Trò chơi</Link>
                  {game.tags?.[0] && (
                    <>
                      <span className="game-breadcrumbs-sep" aria-hidden>
                        »
                      </span>
                      <span>{game.tags[0]}</span>
                    </>
                  )}
                  <span className="game-breadcrumbs-sep" aria-hidden>
                    »
                  </span>
                  <span className="game-breadcrumbs-current">{title}</span>
                </nav>
              )}

              <section
                ref={relatedMasonryRef}
                className="game-related-masonry-section"
                aria-labelledby="game-related-masonry-heading"
              >
                <h2
                  id="game-related-masonry-heading"
                  className="game-related-masonry-title"
                >
                  Game liên quan
                </h2>
                {relatedStatus === "loading" && (
                  <p className="game-masonry-status">Đang tải...</p>
                )}
                {relatedStatus === "success" && relatedGames.length === 0 && (
                  <p className="game-masonry-status">Chưa có game liên quan.</p>
                )}
                {relatedGames.length > 0 && (
                  <Masonry
                    columns={relatedMasonryColumns}
                    list={relatedGames}
                    className="game-related-masonry"
                    columnClassName="game-related-masonry-column"
                    renderItem={(related) => (
                      <GameMasonryCard game={related} />
                    )}
                  />
                )}
              </section>
              </main>

              <aside className="sidebar">
                <AdBanner variant="square" className="sidebar-ad" />

                <div className="related-section">
                  <h2 className="related-title">Phát tiếp theo</h2>
                  {relatedStatus === "loading" && (
                    <p className="game-masonry-status">Đang tải...</p>
                  )}
                  {relatedStatus === "success" && relatedGames.length === 0 && (
                    <p className="game-masonry-status">Chưa có game liên quan.</p>
                  )}
                  {relatedGames.length > 0 && (
                    <div className="related-list">
                      {relatedGames.map((related) => (
                        <GameMasonryCard key={related.id} game={related} />
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
