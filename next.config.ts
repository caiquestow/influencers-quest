/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Mantém o modo estrito do React
  images: {
    domains: ['api.placeholder.com'], // Domínios permitidos para imagens
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorar erros do ESLint durante o build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar erros de compilação do TypeScript
  },
};

module.exports = nextConfig;
