const SKELETON_META_COUNT = 2;
const SKELETON_TAG_COUNT = 4;
const SKELETON_THUMB_COUNT = 5;

export default function HeroBannerSkeleton() {
  return (
    <section
      className="hero-banner hero-banner--skeleton"
      aria-busy="true"
      aria-label="Đang tải banner"
    >
      <div className="hero-banner-bg hero-banner-bg--skeleton" aria-hidden />
      <div className="hero-banner-overlay" aria-hidden />
      <div className="hero-banner-inner">
        <div className="hero-banner-content">
          <h2 className="hero-banner-title hero-banner-title--skeleton">
            &nbsp;
          </h2>
          <p className="hero-banner-subtitle hero-banner-subtitle--skeleton">
            &nbsp;
          </p>
          <div className="hero-banner-meta">
            {Array.from({ length: SKELETON_META_COUNT }, (_, index) => (
              <span
                key={index}
                className="hero-banner-meta-tag hero-banner-meta-tag--skeleton"
                aria-hidden
              />
            ))}
          </div>
          <div className="hero-banner-tags">
            {Array.from({ length: SKELETON_TAG_COUNT }, (_, index) => (
              <span
                key={index}
                className="hero-banner-tag hero-banner-tag--skeleton"
                aria-hidden
              />
            ))}
          </div>
          <p className="hero-banner-desc hero-banner-desc--skeleton">
            <span className="hero-banner-desc-line" aria-hidden />
            <span className="hero-banner-desc-line" aria-hidden />
            <span className="hero-banner-desc-line hero-banner-desc-line--short" aria-hidden />
          </p>
        </div>
        <div className="hero-banner-thumbs">
          {Array.from({ length: SKELETON_THUMB_COUNT }, (_, index) => (
            <div
              key={index}
              className="hero-banner-thumb hero-banner-thumb--skeleton"
              aria-hidden
            />
          ))}
        </div>
      </div>
    </section>
  );
}
