import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    publicDir: "public",
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_DATA_URL),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8MB
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
          runtimeCaching: [
            {
        urlPattern: new RegExp(env.VITE_DATA_URL),
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
          ],
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
  };
});

