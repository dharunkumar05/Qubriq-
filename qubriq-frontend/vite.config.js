import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: { proxy: { "/api": { target: process.env.VITE_BACKEND_URL || "https://localhost:7001", changeOrigin: true, secure: false } } },
}));
