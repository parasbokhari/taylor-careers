import { NextResponse } from "next/server";
import { isPreviewSite } from "@/app/lib/preview";

export function proxy(request) {
  const response = NextResponse.next();
  if (isPreviewSite() || request.nextUrl.hostname === "jobs-taylor-staging.vercel.app") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: "/:path*",
};
