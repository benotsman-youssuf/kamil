import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  // Removed base: "./" to fix relative path issues
  publicDir: "public",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        
      },
      includeAssets: ["favicon.ico", "logo.png", "image.png", "icons/*.png"],
      manifest: {
        name: "كمل",
        short_name: "كمل",
        description: "كمل - محرر نصوص عربي متقدم",
        screenshots: [
          {
            src: "image.png", // Removed "./" prefix
            sizes: "640x320",
            type: "image/png",
            form_factor: "wide",
            label: "Wonder Widgets",
          },
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icons/16x16.png", // Removed "./" prefix
            sizes: "16x16",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icons/32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "icons/48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "icons/64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "icons/128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icons/1024x1024.png",
            sizes: "1024x1024",
            type: "image/png",
          },
          {
            src: "icons/logo.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});