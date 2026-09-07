import { NextResponse, type NextRequest } from "next/server";

const translatedLocales = new Set(["en", "de", "ru"]);

export function proxy(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean)[0];
  const locale = firstSegment && translatedLocales.has(firstSegment)
    ? firstSegment
    : "tr";
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-mi-hotel-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/|images/|brand/|favicon\\.png|apple-touch-icon\\.png|.*\\.[^/]+$).*)"],
};
