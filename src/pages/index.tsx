import API from "@/api";
import { SEO, CategoryCards, HeroBanner, TopNav, HomeGameMasonryList, If, SwitchRender } from "@/components";
import { useEffect, useRef, useState } from "react";
import { useFetch, useInfiniteScroll } from "@/hooks";
import type { IGame } from "@/interfaces";

const PAGE_SIZE = 20;
const HOME_SCROLL_ID = "home-scroll";

export default function Home() {
  const { data: featuredData, status: featuredStatus } = useFetch(() =>
    API.game.getList({ featured: true, limit: 20, status: "published" }),
  );

  const { data: categoryData, status: categoryStatus } = useFetch(() =>
    API.category.getList({ status: "active" }),
  );

  const categories = [...(categoryData?.data ?? [])].sort(
    (a, b) => (b.order ?? 0) - (a.order ?? 0),
  );

  const [error, setError] = useState<unknown>(null);
  const [hasError, setHasError] = useState(false);
  const pageRef = useRef(0);

  const [masonryColumns, setMasonryColumns] = useState(4);

  const {
    items: games,
    isLoading: loadingMore,
    isFull,
  } = useInfiniteScroll<IGame>({
    containerId: HOME_SCROLL_ID,
    onReset: () => {
      pageRef.current = 0;
      setError(null);
      setHasError(false);
    },
    onLoadMore: async () => {
      const nextPage = pageRef.current + 1;

      try {
        setError(null);
        setHasError(false);

        const res = await API.game.getList({
          page: nextPage,
          limit: PAGE_SIZE,
          sort: "newest",
          status: "published",
        });

        pageRef.current = nextPage;
        return res.data ?? [];
      } catch (err) {
        setError(err);
        setHasError(true);
        throw err;
      }
    },
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 520) setMasonryColumns(2);
      else if (w < 900) setMasonryColumns(3);
      else setMasonryColumns(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const masonryView = hasError
    ? "error"
    : games === undefined || (loadingMore && games.length === 0)
      ? "loading"
      : games.length === 0
        ? "empty"
        : "list";

  return (
    <div className="home">
      <SEO title="Trò chơi" />
      <div id={HOME_SCROLL_ID} className="home-scroll">
        <div className="layout">
          <TopNav />
          <main className="main">
            <CategoryCards
              categories={categories}
              loading={categoryStatus === "loading"}
            />

            <If
              condition={
                featuredStatus === "success" &&
                featuredData?.data?.length &&
                featuredData?.data?.length > 0
              }
            >
              <HeroBanner games={featuredData?.data ?? []} />
            </If>

            <section
              className="game-masonry-section"
              aria-labelledby="game-masonry-heading"
            >
              <div className="game-masonry-head">
                <h2 id="game-masonry-heading" className="game-masonry-title">
                  Khám phá game
                </h2>
                <p className="game-masonry-sub">Gợi ý cho bạn</p>
              </div>

              <SwitchRender
                sw={masonryView}
                render={{
                  loading: <p className="game-masonry-status">Đang tải...</p>,
                  error: (
                    <p className="game-masonry-status">Lỗi: {String(error)}</p>
                  ),
                  empty: <p className="game-masonry-status">Chưa có game.</p>,
                  list: (
                    <HomeGameMasonryList
                      games={games ?? []}
                      columns={masonryColumns}
                      loadingMore={loadingMore}
                      isFull={isFull}
                    />
                  ),
                }}
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
