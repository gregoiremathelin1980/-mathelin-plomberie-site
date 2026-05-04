"use client";

import Script from "next/script";

/**
 * Analytics optionnel, chargé en lazy pour ne pas bloquer le rendu (LCP).
 * Définir NEXT_PUBLIC_GA_MEASUREMENT_ID dans Vercel pour activer.
 */
export default function DeferredAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`} strategy="lazyOnload" />
      <Script id="ga-mathelin" strategy="lazyOnload">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)}, { send_page_view: true });
`}
      </Script>
    </>
  );
}
