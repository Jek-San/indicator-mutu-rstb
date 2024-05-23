import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";
  const unit_id = request.cookies.get("unit_id")
    ? request.cookies.get("unit_id")?.value
    : null;
  const is_admin = request.cookies.get("is_admin")?.value;
  const loginPage = new URL("/login", request.url).pathname;

  if (isLoggedIn && request.nextUrl.pathname === loginPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  if (isLoggedIn && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isLoggedIn && request.nextUrl.pathname !== loginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/menus",
    "/units",
    "/indicators",
    "/monthlydata",
    "/login",
    "/home",
  ],
};
