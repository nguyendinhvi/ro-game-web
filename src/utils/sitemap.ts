import type { ApiResponse } from "@/utils/https";
import { https } from "@/utils/https";
import type { ICategory } from "@/interfaces/model/category";
import type { IGame } from "@/interfaces/model/game";

const SITEMAP_PAGE_SIZE = 100;

export interface ISitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: number;
}

export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is required to generate sitemap.xml");
  }
  return siteUrl;
}

export function toAbsoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastmod(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

async function fetchPaginated<T>(
  path: string,
  params: Record<string, string | number | boolean>,
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await https.get<T[], ApiResponse<T[]>>(path, {
      params: {
        ...params,
        page,
        limit: SITEMAP_PAGE_SIZE,
      },
    });

    items.push(...(response.data ?? []));
    totalPages = response.meta?.total_pages ?? 1;
    page += 1;
  }

  return items;
}

export async function buildSitemapUrls(): Promise<ISitemapUrl[]> {
  const [games, categories] = await Promise.all([
    fetchPaginated<IGame>("/games", {
      status: "published",
      sort: "newest",
    }),
    fetchPaginated<ICategory>("/categories", {
      status: "active",
      sort: "newest",
    }),
  ]);

  const urls: ISitemapUrl[] = [
    {
      loc: toAbsoluteUrl("/"),
      changefreq: "daily",
      priority: 1,
    },
    {
      loc: toAbsoluteUrl("/privacy"),
      changefreq: "monthly",
      priority: 0.3,
    },
    {
      loc: toAbsoluteUrl("/terms"),
      changefreq: "monthly",
      priority: 0.3,
    },
    {
      loc: toAbsoluteUrl("/contact"),
      changefreq: "monthly",
      priority: 0.3,
    },
  ];

  for (const category of categories) {
    if (!category.slug) {
      continue;
    }

    urls.push({
      loc: toAbsoluteUrl(`/category/${encodeURIComponent(category.slug)}`),
      lastmod: formatLastmod(category.updated_at ?? category.created_at),
      changefreq: "weekly",
      priority: 0.8,
    });
  }

  for (const game of games) {
    if (!game.slug) {
      continue;
    }

    urls.push({
      loc: toAbsoluteUrl(`/game/${encodeURIComponent(game.slug)}`),
      lastmod: formatLastmod(game.updated_at ?? game.created_at),
      changefreq: "weekly",
      priority: 0.7,
    });
  }

  return urls;
}

export function renderSitemapXml(urls: ISitemapUrl[]): string {
  const body = urls
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`];

      if (entry.lastmod) {
        parts.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
      }
      if (entry.changefreq) {
        parts.push(
          `    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`,
        );
      }
      if (entry.priority != null) {
        parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }

      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
