import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base path matches the GitHub Pages project URL (/<repo-name>/).
export default defineConfig({
  plugins: [react()],
  base: "/aufma-/",
});
