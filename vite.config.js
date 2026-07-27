import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this app from https://<username>.github.io/<repo-name>/
  // so the base path must match your repo name exactly, including the slashes.
  // If you deploy to a custom domain or Vercel/Netlify instead, change this back to "/".
  base: "/glow-by-bvy/",
});