import { NextResponse } from "next/server";
import { generateTemperatureSitemap } from "@/lib/seo/temperatureSitemapEngine";
import { resolveSitemapOrigin } from "@/lib/seo/canonicalSite";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    // Origen canónico (www en producción), NO NEXT_PUBLIC_SITE_URL: este fichero
    // es hijo del índice maestro `/sitemap-index.xml` y un `<loc>` en el apex se
    // paga con un 308 por URL (ver src/lib/seo/canonicalSite.ts).
    const xml = generateTemperatureSitemap(resolveSitemapOrigin());
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Error generando sitemap", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
