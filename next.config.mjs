/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  // output: "export",
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;
