/** @type {import('next').NextConfig} */
const nextConfig = {
     reactStrictMode: true,
     sassOptions: {
          includePaths: ['./src/styles'],
     },
     rewrites: async () => {
          return {
               fallback: [
                    {
                         source: '/api/:path*',
                         destination: 'http://localhost:5000/api/:path*',
                    },
               ],
          };
     },
};

module.exports = nextConfig;
