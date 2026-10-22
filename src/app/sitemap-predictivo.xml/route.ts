import { NextResponse } from "next/server";
import { generateTemperatureSitemap } from "@/lib/seo/temperatureSitemapEngine";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const xml = generateTemperatureSitemap(process.env.NEXT_PUBLIC_SITE_URL);
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
