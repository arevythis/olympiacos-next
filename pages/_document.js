import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add your stylesheets here */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        
        {/* Favicon link */}
        <link rel="icon" href="/oly.png" />
        {/* Optional: Add different favicon sizes for different devices */}
        <link rel="icon" href="/oly.png" sizes="32x32" />
        <link rel="icon" href="/oly.png" sizes="16x16" />
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/oly.png" sizes="180x180" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
