import { defineConfig } from "vite";
import voidPlugin from "void/vite";

export default defineConfig({
  plugins: [voidPlugin()],
  server: {
    port: 3000,
  },
  ssr: {
    external: ["better-sqlite3"],
  },
  build: {
    target: "esnext",
  },
});
