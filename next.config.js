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
      { source: "/conseils/isolation-tuyaux", destination: "/conseils/protection-gel", permanent: true },
      // Pages retirées du contenu → page la plus proche
      { source: "/realisations/debouchage-canalisation-meximieux", destination: "/services/debouchage-canalisation", permanent: true },
      { source: "/realisations/reparation-fuite-perouges", destination: "/services/reparation-fuite", permanent: true },
      { source: "/conseils/desembouage-a-meximieux-2026-06-26", destination: "/conseils/desembouage-chauffage", permanent: true },
      // Fiches d'interventions supprimées (cas non réels) → page locale la plus proche
      { source: "/interventions/fuite-sous-evier-amberieu", destination: "https://www.plombier-amberieu.fr/", permanent: true },
      { source: "/interventions/wc-bouche-meximieux-allagniers", destination: "https://www.plombier-meximieux.fr/", permanent: true },
      { source: "/interventions/chauffe-eau-lagnieu", destination: "/plombier/lagnieu", permanent: true },
      { source: "/interventions/debouchage-douche-perouges", destination: "/zones-intervention", permanent: true },
      { source: "/interventions/radiateur-froid-saint-vulbas", destination: "/plombier/saint-vulbas", permanent: true },
      { source: "/interventions/fuite-chauffe-eau-villieu", destination: "/plombier/villieu-loyes-mollon", permanent: true },
      { source: "/interventions/chaudiere-pression-amberieu", destination: "https://www.plombier-amberieu.fr/", permanent: true },
      { source: "/interventions/robinet-cuisine-meximieux", destination: "https://www.plombier-meximieux.fr/", permanent: true },
      { source: "/interventions/canalisation-bouchee-lagnieu", destination: "/plombier/lagnieu", permanent: true },
      { source: "/interventions/fuite-wc-saint-denis-bugey", destination: "/plombier/saint-denis-en-bugey", permanent: true },
      { source: "/interventions/detartrage-ballon-chateau-gaillard", destination: "/zones-intervention", permanent: true },
      { source: "/interventions/thermostat-chaudiere-pont-ain", destination: "/zones-intervention", permanent: true },
      { source: "/interventions/debouchage-evier-rignieux", destination: "/plombier/rignieux-le-franc", permanent: true },
      { source: "/interventions/purge-radiateurs-douvres", destination: "/zones-intervention", permanent: true },
      { source: "/interventions/groupe-securite-beligneux", destination: "/plombier/beligneux", permanent: true },
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
        hostname: "www.mathelin-plomberie.fr",
        pathname: "/images/**",
      },
      ...geocomptaRemotePatterns,
    ],
  },
};

module.exports = nextConfig;
