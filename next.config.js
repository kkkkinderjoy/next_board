/** @type {import('next').NextConfig} */
const nextConfig = {
    env : {
        NEXT_PUBLIC_DATABASE_HOST : process.env.NEXT_PUBLIC_DATABASE_HOST,
        NEXT_PUBLIC_DATABASE_USERNAME : process.env.NEXT_PUBLIC_DATABASE_USERNAME,
        NEXT_PUBLIC_DATABASE_PASSWORD : process.env.NEXT_PUBLIC_DATABASE_PASSWORD,
        NEXT_PUBLIC_DATABASE_NAME : process.env.NEXT_PUBLIC_DATABASE_NAME,
    }

}

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
};