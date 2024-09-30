import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const DEEPL_AUTH_KEY = "";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "setupTests.js",
  },
  server: {
    proxy: {
      "/api/deepl": {
        target: "https://api-free.deepl.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepl/, "/v2"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "Authorization",
              `DeepL-Auth-Key ${DEEPL_AUTH_KEY}`
            );
          });
        },
      },
    },
  },
});
