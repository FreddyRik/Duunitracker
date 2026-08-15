import { NextResponse } from "next/server";
import { buildDashboardImportUrl } from "@/lib/share-target/intake";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const dest = buildDashboardImportUrl(new URL(request.url));
  const response = NextResponse.redirect(dest, 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
