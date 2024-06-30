/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https', // Allow any HTTPS protocol
                hostname: '*',       // Allow any hostname
            },
        ],
    },
};

export default nextConfig;
