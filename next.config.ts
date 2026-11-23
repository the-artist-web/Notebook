/**
 * Node modules
 */
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
 
const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
      serverActions: {
          bodySizeLimit: "10mb",
      },
  },
  images: {
    remotePatterns: [
        {
            protocol: "https",
            hostname: supabaseUrl.hostname,
            pathname: "/storage/v1/object/public/**",
        },
    ],
}
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);