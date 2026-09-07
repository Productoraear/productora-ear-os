/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: '*.bodas.net',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
        domains: [
            'firebasestorage.googleapis.com',
            'cdn.bodas.net',
            'cdn0.bodas.net',
            'cdn1.bodas.net',
            'cdn2.bodas.net',
            'cdn3.bodas.net',
            'images.unsplash.com',
            'lh3.googleusercontent.com',
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ['firebase-admin'],
    },
};

module.exports = nextConfig;
