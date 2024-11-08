import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { JWT } from "next-auth/jwt"; // Import the JWT type from next-auth

// Define roles required for specific routes
const protectedRoutes = {
  "/producers": ["Producers", "Admin"], // Allow both Producers and Admin roles
  "/admin": ["Admin"], // Only allow Admin role for /admin
};

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) as JWT | null;
  const currentPath = request.nextUrl.pathname;

  // Check if the route is protected
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    // Match paths starting with the route (e.g., /producers/*)
    if (currentPath.startsWith(route)) {
      // If no token, the user is unauthenticated; redirect to authentication page
      if (!token) {
        return NextResponse.redirect(new URL("/authentication", request.url));
      }

      // Extract the user role from the token and convert to lowercase for consistent comparison
      const userRole = (token.role as string | undefined)?.toLowerCase();

      // Check if any required role (normalized to lowercase) matches the user's role
      const hasAccess = roles.some((role) => role.toLowerCase() === userRole);

      // If the user is authenticated but has an incorrect role, redirect to the home page
      if (!userRole || !hasAccess) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // If role matches, allow access
      break;
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Define the paths that the middleware should run on
export const config = {
  matcher: [
    "/producers/:path*", // Match all paths under /producers
    "/admin/:path*",     // Match all paths under /admin
  ],
};
