import { defineConfig } from "vitest/config";
  import react from "@vitejs/plugin-react";
  import { resolve } from "path";

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      css: false,
      include: ["src/**/*.test.{ts,tsx}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov", "json-summary"],
        include: ["src/components/**/*.{ts,tsx}"],
        exclude: ["src/**/*.stories.{ts,tsx}", "src/**/*.types.ts", "src/test/**"],
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  });