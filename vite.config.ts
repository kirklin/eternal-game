import { resolve } from "node:path";
import { defineConfig } from "vite";
import { isDev, port } from "./scripts/utils";
import packageJson from "./package.json";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
    },
  },
  server: {
    host: "localhost",
    port,
    open: true,
    proxy: {},
  },
  define: {
    __DEV__: isDev,
    __NAME__: JSON.stringify(packageJson.name),
  },
  build: {
    target: "es2015",
    minify: "terser",
    cssTarget: "chrome80",
    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
