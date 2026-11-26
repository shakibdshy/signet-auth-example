import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const withVarlock = varlockNextConfigPlugin();
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  // Emailed links point at this app's origin ({AppURL}/auth/... on the backend
  // config), so forwarded GETs hit the same-origin proxy and Set-Cookie stays
  // first-party. Filesystem routes (e.g. /auth/callback) take precedence.
  async rewrites() {
    return [{ source: "/auth/:path*", destination: "/api/signet/:path*" }];
  },
};

export default withVarlock(nextConfig);
