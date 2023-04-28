import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          strategy="beforeInteractive"
          id="google-maps"
          type="text/javascript"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_AUTOCOMPLETE_KEY}&libraries=places`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
