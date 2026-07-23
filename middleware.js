/**
 * Block indexing of any *.vercel.app deployment URL.
 * Production traffic must live only on https://drhoney.xyz
 */
export const config = {
  matcher: "/:path*",
};

export default function middleware(request) {
  const host = (request.headers.get("host") || "").toLowerCase();
  if (!host.endsWith(".vercel.app")) {
    return; // continue to static asset / page
  }

  const dest = new URL(request.url);
  dest.protocol = "https:";
  dest.hostname = "drhoney.xyz";
  dest.port = "";

  return new Response(null, {
    status: 308,
    headers: {
      Location: dest.toString(),
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
