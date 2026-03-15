import { Html, Head, Main, NextScript } from "next/document";
import { poppins } from "@/fonts";

export default function Document() {
  return (
    <Html lang="en" className={poppins.variable}>
      <Head>
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
