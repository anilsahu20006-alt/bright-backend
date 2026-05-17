import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy to Vercel: TanStack Start uses Nitro under the hood.
// Setting target: "vercel" produces a .vercel/output/ Build Output v3 bundle
// that Vercel serves directly — SSR + all routes work on *.vercel.app.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    target: "vercel",
    server: { entry: "server" },
  },
});
