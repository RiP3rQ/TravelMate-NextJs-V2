import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_AUTOCOMPLETE_KEY}&libraries=places`}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
