import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      // Makalu Adventure API
      "/api": {
        target: "https://makaluadventure.com",
        changeOrigin: true,
        secure: true,
      },

      // Gateway Treks API
      "/gateway-api": {
        target: "https://gatewaytreks.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/gateway-api/, ""),
      },
    },
  },
});