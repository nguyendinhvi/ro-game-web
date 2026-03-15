export default function CategoryHeroSkeleton() {
  return (
    <header
      className="category-hero category-hero--skeleton"
      aria-busy="true"
      aria-label="Đang tải thông tin danh mục"
    >
      <span className="category-hero-emoji" aria-hidden />
      <div className="category-hero-content">
        <h1 className="category-hero-title">&nbsp;</h1>
        <p className="category-hero-desc">&nbsp;</p>
      </div>
    </header>
  );
}
