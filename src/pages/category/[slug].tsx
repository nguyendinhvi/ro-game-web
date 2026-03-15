import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import API from "@/api";
import {
  CategoryCards,
  CategoryHeroSkeleton,
  HomeGameMasonryList,
  If,
  SEO,
  SwitchRender,
  TopNav,
} from "@/components";
import { useFetch, useInfiniteScroll } from "@/hooks";
import type { ICategory, IGame } from "@/interfaces";

const PAGE_SIZE = 20;
const CATEGORY_SCROLL_ID = "category-scroll";

function buildCategoryDescription(category: ICategory): string {
  if (category.description?.trim()) {
    return category.description.trim();
  }
  return `Khám phá và chơi game ${category.name} online miễn phí trên RO Game.`;
}

export default function CategoryPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const isReady = router.isReady && slug.length > 0;

  const {
    data: category,
    status: categoryStatus,
    error: categoryError,
  } = useFetch(() => API.category.getBySlug(slug), [slug], isReady);

  const { data: categoryListData, status: categoryListStatus } = useFetch(() =>
    API.category.getList({ status: "active" }),
  );

  const categories: ICategory[] = [...(categoryListData?.data ?? [])].sort(
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
    containerId: CATEGORY_SCROLL_ID,
    dependency: slug,
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
          category: slug,
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

  const pageTitle = category?.name ?? "Danh mục game";
  const pageDescription = category
    ? buildCategoryDescription(category)
    : "Khám phá game theo danh mục trên RO Game.";

  return (
    <div className="home category-page">
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical={`/category/${slug}`}
      />
      <div id={CATEGORY_SCROLL_ID} className="home-scroll">
        <div className="layout">
          <TopNav />
          <main className="main">
            <nav className="category-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span aria-hidden>/</span>
              <span>{pageTitle}</span>
            </nav>

            {["loading", "init"].includes(categoryStatus) && (
              <CategoryHeroSkeleton />
            )}
            {categoryStatus === "error" && (
              <p className="game-masonry-status game-fetch-status--error">
                Không tìm thấy danh mục: {String(categoryError)}
              </p>
            )}
            {categoryStatus === "success" && category && (
              <header className="category-hero">
                <If condition={category.emoji}>
                  <span className="category-hero-emoji" aria-hidden>
                    {category.emoji}
                  </span>
                </If>
                <div className="category-hero-content">
                  <h1 className="category-hero-title">{category.name}</h1>
                  {category.description?.trim() ? (
                    <p className="category-hero-desc">{category.description}</p>
                  ) : (
                    <p className="category-hero-desc">{pageDescription}</p>
                  )}
                </div>
              </header>
            )}

            <CategoryCards
              categories={categories}
              activeSlug={slug}
              loading={categoryListStatus === "loading"}
            />

            <section
              className="game-masonry-section"
              aria-labelledby="category-games-heading"
            >
              <div className="game-masonry-head">
                <h2 id="category-games-heading" className="game-masonry-title">
                  Game {category?.name ?? "theo danh mục"}
                </h2>
                <p className="game-masonry-sub">
                  Tất cả game thuộc danh mục này
                </p>
              </div>

              <SwitchRender
                sw={masonryView}
                render={{
                  loading: <p className="game-masonry-status">Đang tải...</p>,
                  error: (
                    <p className="game-masonry-status">Lỗi: {String(error)}</p>
                  ),
                  empty: (
                    <p className="game-masonry-status">
                      Chưa có game trong danh mục này.
                    </p>
                  ),
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
