/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath: '/nome-do-repo',  // Descomente e ajuste se o repo não for username.github.io
  trailingSlash: true,
  images: {
    unoptimized: true,  // Necessário para export estático
  },
}

module.exports = nextConfig
