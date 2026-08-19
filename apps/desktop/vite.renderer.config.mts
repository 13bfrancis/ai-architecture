import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const contentSecurityPolicyPlugin = (development: boolean): Plugin => ({
  name: "ai-architecture-content-security-policy",
  transformIndexHtml: (html) => {
    const scriptSource = development ? "script-src 'self' 'unsafe-inline'" : "script-src 'self'";
    const connectSource = development
      ? "connect-src 'self' http://localhost:* ws://localhost:*"
      : "connect-src 'self'";
    const styleSource = development ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'";
    const policy = [
      "default-src 'self'",
      scriptSource,
      styleSource,
      "img-src 'self' data:",
      "font-src 'self'",
      connectSource,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'none'",
      "frame-ancestors 'none'",
    ].join("; ");

    return html.replace("__CONTENT_SECURITY_POLICY__", policy);
  },
});

export default defineConfig(({ command }) => ({
  base: "./",
  plugins: [
    contentSecurityPolicyPlugin(command === "serve"),
    tailwindcss(),
    tanstackRouter({
      autoCodeSplitting: true,
      generatedRouteTree: "./src/renderer/routeTree.gen.ts",
      routesDirectory: "./src/renderer/routes",
      target: "react",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/renderer", import.meta.url)),
    },
  },
}));
