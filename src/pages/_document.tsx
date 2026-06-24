import { Html, Head, Main, NextScript } from "next/document";
import { GOOGLE_ADSENSE_CLIENT } from "@/components/GoogleAdSenseUnit";
import { poppins } from "@/fonts";

export default function Document() {
  return (
    <Html lang="en" className={poppins.variable}>
      <Head>
        <meta
          name="google-adsense-account"
          content={GOOGLE_ADSENSE_CLIENT}
        />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </Head>
      <body className={poppins.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
