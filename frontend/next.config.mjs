/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from Cloudinary and Replicate CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
      },
    ],
  },
};

export default nextConfig;
