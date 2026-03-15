export const SITE_NAME = "RO Game";

export const DEFAULT_SEO = {
  title: "Trò chơi",
  description: "Khám phá game hay, lựa chọn của biên tập viên",
} as const;

export const DEFAULT_OG_IMAGE = "/images/logo.png";

export function buildPageTitle(title: string): string {
  const suffix = ` - ${SITE_NAME}`;

  if (title === SITE_NAME || title.endsWith(suffix)) {
    return title;
  }

  return `${title}${suffix}`;
}

export function resolveAbsoluteUrl(path: string): string | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (!siteUrl) {
    return undefined;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
