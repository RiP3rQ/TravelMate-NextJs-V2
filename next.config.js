/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "links.papareact.com",
      "firebasestorage.googleapis.com",
      "st3.depositphotos.com",
    ],
  },
};

module.exports = nextConfig;
