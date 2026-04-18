/** @type {import('next').NextConfig} */
const geocomptaImageHosts = (process.env.GEOCOMPTA_IMAGE_HOSTS || "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const geocomptaRemotePatterns = geocomptaImageHosts.map((hostname) => ({
  protocol: "https",
  hostname,
  pathname: "/**",
}));

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: "/estimate", destination: "/devis", permanent: true },
      { source: "/projects", destination: "/realisations", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photos.mathelin-plomberie.fr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...geocomptaRemotePatterns,
    ],
  },
};

module.exports = nextConfig;
