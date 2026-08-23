import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url") || "https://www.productoraear.com/api/tools/download-cue-bridge";
    const format = searchParams.get("format") || "svg";

    if (format === "png") {
      const pngBuffer = await QRCode.toBuffer(targetUrl, {
        type: "png",
        width: 512,
        margin: 2,
        color: {
          dark: "#050505",
          light: "#ecb613",
        },
      });

      return new NextResponse(pngBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    // Default SVG
    const svgString = await QRCode.toString(targetUrl, {
      type: "svg",
      width: 320,
      margin: 2,
      color: {
        dark: "#ecb613",
        light: "#050505",
      },
    });

    return new NextResponse(svgString, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al generar código QR", details: error.message },
      { status: 500 }
    );
  }
}
