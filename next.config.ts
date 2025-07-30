/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/pdz-api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

export default nextConfig;
