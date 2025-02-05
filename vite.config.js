import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";  // ✅ Ensure this import is present

export default defineConfig({
  plugins: [react()],  // ✅ Ensure the React plugin is included
});


