import type { GetServerSideProps } from "next";
import { getSiteUrl } from "@/utils/sitemap";

export default function RobotsPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const siteUrl = getSiteUrl();
    const body = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    res.write(body);
    res.end();
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write(
      error instanceof Error ? error.message : "Failed to generate robots.txt",
    );
    res.end();
  }

  return { props: {} };
};
