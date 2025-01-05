import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { JWT } from "next-auth/jwt"; 

const protectedRoutes = {
  "/producers": ["Producers", "Admin"], 
  "/admin": ["Admin"], 
};

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) as JWT | null;
  const currentPath = request.nextUrl.pathname;

  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (currentPath.startsWith(route)) {
      if (!token) {
        return NextResponse.redirect(new URL("/authentication", request.url));
      }

      const userRole = (token.role as string | undefined)?.toLowerCase();

      const hasAccess = roles.some((role) => role.toLowerCase() === userRole);

      if (!userRole || !hasAccess) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      break;
    }
  }

  return NextResponse.next();
}

// Define the paths that the middleware should run on
export const config = {
  matcher: [
    "/producers/:path*", // Match all paths under /producers
    "/admin/:path*",     // Match all paths under /admin
  ],
};
