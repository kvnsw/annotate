const bundleAnalyzer = require('@next/bundle-analyzer');
const { i18n } = require('./next-i18next.config');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    dirs: ['src'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
