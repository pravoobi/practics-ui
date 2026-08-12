import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["test/**/*.test.ts"],
    // Integration tests need the generated file — skip gracefully if absent
    testTimeout: 10000,
  },
});
