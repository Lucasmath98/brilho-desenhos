// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages: build estático servido em /brilho-desenhos/ (ativado via GITHUB_PAGES=true no workflow)
const isGhPages = process.env["GITHUB_PAGES"] === "true";
const base = isGhPages ? "/brilho-desenhos/" : "/";

export default defineConfig({
  vite: {
    base,
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        manifest: false,
        base,
        scope: base,
        devOptions: { enabled: false },
        workbox: {
          navigateFallbackDenylist: [/^\/api\//, /^\/~oauth/],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: { cacheName: "appflix-pages", networkTimeoutSeconds: 4 },
            },
            {
              urlPattern: ({ request, url }) => url.origin === self.location.origin && ["script", "style", "image", "font"].includes(request.destination),
              handler: "CacheFirst",
              options: { cacheName: "appflix-assets", expiration: { maxEntries: 80, maxAgeSeconds: 2592000 } },
            },
          ],
        },
      }),
    ],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isGhPages
      ? { spa: { enabled: true, prerender: { outputPath: "/index.html", crawlLinks: false } } }
      : {}),
  },
});
