import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server:
  {
    allowedHosts: [
      "localhost",
      "3a92-2400-1a00-b060-46bb-1192-92a9-239e-f463.ngrok-free.app"
    ],
  }
});