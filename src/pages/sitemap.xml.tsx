import type { GetServerSideProps } from "next";
import { buildSitemapUrls, renderSitemapXml } from "@/utils/sitemap";

export default function SitemapPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const urls = await buildSitemapUrls();
    const xml = renderSitemapXml(urls);

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    res.write(xml);
    res.end();
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write(
      error instanceof Error
        ? error.message
        : "Failed to generate sitemap.xml",
    );
    res.end();
  }

  return { props: {} };
};
