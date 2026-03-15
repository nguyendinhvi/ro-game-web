interface IProps {
  variant?: "square" | "horizontal";
  label?: string;
  title?: string;
  className?: string;
}

export default function AdBanner({
  variant = "square",
  label = "Quảng cáo",
  title = "RO Game Media",
  className = "",
}: IProps) {
  return (
    <aside
      className={`ad-banner ad-banner--${variant}${className ? ` ${className}` : ""}`}
      aria-label={label}
    >
      <span className="ad-banner-label">{label}</span>
      <div className="ad-banner-inner">
        <span className="ad-banner-brand">{title}</span>
        <p className="ad-banner-copy">
          Khám phá tin tức, sự kiện và ưu đãi mới nhất dành cho game thủ.
        </p>
        <span className="ad-banner-cta">Tìm hiểu thêm</span>
      </div>
    </aside>
  );
}
