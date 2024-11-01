// app/api/manifest/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { MetadataRoute } from "next";

export async function GET(request: NextRequest) {
  const theme = request.nextUrl.searchParams.get("theme") || "light";
  
  const manifest: MetadataRoute.Manifest = {
    name: "isubscribe",
    short_name: "isubscribe",
    description: "A subscription platform for all your needs",
    start_url: "/",
    display: "standalone",
    background_color: theme === "dark" ? "#111827" : "#ffffff",
    theme_color: theme === "dark" ? "#111827" : "#ffffff",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return NextResponse.json(manifest);
}
