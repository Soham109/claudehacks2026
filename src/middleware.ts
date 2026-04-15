import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/find-table/:path*",
    "/schedule/:path*",
    "/my-tables/:path*",
    "/profile/:path*",
    "/table/:path*",
    "/onboarding/:path*",
  ],
};
