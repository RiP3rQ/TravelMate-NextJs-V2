/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["links.papareact.com", "firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;
