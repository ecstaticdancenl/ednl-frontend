/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/staging",
  trailingSlash: true,
};

module.exports = nextConfig;
