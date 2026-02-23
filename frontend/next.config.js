/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Caché de build: en CI (p. ej. Render) el aviso "No build cache found" es normal en el primer build.
  // Para rebuilds más rápidos, persistir la carpeta .next/cache entre builds si la plataforma lo permite.
  // "No build cache found" en el primer build es normal; en Render cada deploy empieza sin caché.
  // La API corre dentro de Next (Route Handlers en /api/*).
  // async rewrites() { return [{ source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' }]; },
};

module.exports = nextConfig;
