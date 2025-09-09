export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/moderation/:path*",
    "/api/moderation/:path*",
    "/api/user-preferences/:path*",
  ],
};