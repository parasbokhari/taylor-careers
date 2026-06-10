/** @type {import('next').NextConfig} */
const nextConfig = {
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
