import { Html, Head, Main, NextScript } from "next/document";
import { poppins } from "@/fonts";

export default function Document() {
  return (
    <Html lang="en" className={poppins.variable}>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2808196405892823"
          crossOrigin="anonymous"
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
