/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  experimental: {
    largePageDataBytes: 256 * 1000,
  }, 

};

module.exports = nextConfig;
