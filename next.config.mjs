/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/job",
        destination: "/search-results",
        permanent: true,
      },
      {
        source: "/jobs/:path*",
        destination: "/job/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www-taylor-com.sandbox.hs-sites.com",
        port: "",
        pathname: "/hubfs/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
