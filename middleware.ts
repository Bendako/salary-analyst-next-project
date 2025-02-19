import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',  // Home route
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is not public, require authentication
  if (!isPublicRoute(req)) {
    const authObject = await auth();
    if (!authObject.userId) {
      // Redirect to home with attempted route information
      const url = new URL('/', req.url);
      url.searchParams.set('authModal', 'true');
      url.searchParams.set('attemptedRoute', req.nextUrl.pathname);
      
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};