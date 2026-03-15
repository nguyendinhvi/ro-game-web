import Head from "next/head";
import {
  buildPageTitle,
  DEFAULT_OG_IMAGE,
  DEFAULT_SEO,
  resolveAbsoluteUrl,
  SITE_NAME,
} from "@/utils/seo";

export interface ISeoMetadata {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

type IProps = ISeoMetadata;

export default function SEO({
  title,
  description = DEFAULT_SEO.description,
  image = DEFAULT_OG_IMAGE,
  canonical,
  type = "website",
  noIndex = false,
}: IProps) {
  const pageTitle = buildPageTitle(title);
  const ogImage = resolveAbsoluteUrl(image) ?? image;
  const canonicalUrl = canonical ? resolveAbsoluteUrl(canonical) : undefined;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}

export { DEFAULT_SEO, SITE_NAME };
