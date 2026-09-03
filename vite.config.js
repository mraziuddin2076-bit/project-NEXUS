import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    open: true,
  },
  base: mode === "production" ? "/project-NEXUS/" : "/",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
}));
