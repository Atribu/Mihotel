import { NextResponse, type NextRequest } from "next/server";

const translatedLocales = new Set(["en", "de", "ru"]);

const legacyRedirects = new Map([
  ["/i-letişim", "/konum-iletisim"],
  ["/en/i-letişim", "/en/konum-iletisim"],
  ["/keşfet", "/hakkimizda"],
  ["/en/keşfet", "/en/hakkimizda"],
]);

function decodedPathname(pathname: string) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export function proxy(request: NextRequest) {
  const legacyDestination = legacyRedirects.get(
    decodedPathname(request.nextUrl.pathname),
  );

  if (legacyDestination) {
    const destination = request.nextUrl.clone();
    destination.pathname = legacyDestination;
    return NextResponse.redirect(destination, 308);
  }

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
