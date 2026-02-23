/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // La API corre dentro de Next (Route Handlers en /api/*). Si usás backend externo, descomentá y poné NEXT_PUBLIC_API_URL.
  // async rewrites() {
  //   return [{ source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' }];
  // },
};

module.exports = nextConfig;
