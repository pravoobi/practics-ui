#!/usr/bin/env tsx
/**
 * Runs the component test suite (vitest --reporter=json), parses axe-related
 * outcomes per component, and writes mcp/generated/a11y-results.json.
 *
 * Run standalone: tsx scripts/audit-axe.ts
 * Called from extract.ts as a pre-step when AUDIT_A11Y=1 is set.
 */

import { execSync } from "child_process";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { resolve, join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const OUT_DIR = join(__dirname, "../generated");
const OUT_PATH = join(OUT_DIR, "a11y-results.json");

// Patterns that identify an axe/accessibility test
const AXE_TITLE_PATTERNS = [
  /axe/i,
  /audit/i,
  /no violations/i,
  /accessibility/i,
  /a11y/i,
];

function isAxeTest(title: string): boolean {
  return AXE_TITLE_PATTERNS.some((p) => p.test(title));
}

function componentFromPath(filePath: string): string | null {
  // src/components/Button/Button.test.tsx → "Button"
  // src/components/ui/button.test.tsx → "Button" (shadcn-style flat dir)
  const normalized = filePath.replace(/\\/g, "/");
  const match = normalized.match(/src\/components\/([^/]+)\/([^/]+)\.test\./);
  if (!match) return null;
  const [, dir, file] = match;
  if (dir === "ui") {
    return file!.charAt(0).toUpperCase() + file!.slice(1);
  }
  return dir!;
}

export type AxeTestOutcome = "passed" | "failed" | "skipped";

export type ComponentAxeReport = {
  component: string;
  tested: boolean;
  passed: number;
  failed: number;
  violations: string[];  // failure messages from failing axe tests
  runAt: string;
};

export type A11yResults = {
  generatedAt: string;
  totalAxeTests: number;
  components: Record<string, ComponentAxeReport>;
};

function run(): A11yResults {
  const tmpOutput = join(OUT_DIR, "_test-results.json");
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("Running vitest with JSON reporter...");
  try {
    execSync(
      `npx vitest run --reporter=json --outputFile="${tmpOutput}"`,
      {
        cwd: REPO_ROOT,
        stdio: ["ignore", "ignore", "ignore"],
        timeout: 300_000,
      }
    );
  } catch {
    // vitest exits non-zero if tests fail — that's OK, we still want the output
  }

  if (!existsSync(tmpOutput)) {
    console.warn("No test output file generated — a11y results will be empty.");
    return {
      generatedAt: new Date().toISOString(),
      totalAxeTests: 0,
      components: {},
    };
  }

  const raw = JSON.parse(readFileSync(tmpOutput, "utf8")) as {
    testResults: Array<{
      name: string;
      assertionResults: Array<{
        title: string;
        status: string;
        failureMessages: string[];
      }>;
    }>;
  };

  const byComponent: Record<string, ComponentAxeReport> = {};
  let totalAxeTests = 0;

  for (const suite of raw.testResults ?? []) {
    const componentName = componentFromPath(suite.name ?? "");
    if (!componentName) continue;

    for (const test of suite.assertionResults ?? []) {
      if (!isAxeTest(test.title)) continue;
      totalAxeTests++;

      if (!byComponent[componentName]) {
        byComponent[componentName] = {
          component: componentName,
          tested: true,
          passed: 0,
          failed: 0,
          violations: [],
          runAt: new Date().toISOString(),
        };
      }

      const report = byComponent[componentName]!;
      if (test.status === "passed") {
        report.passed++;
      } else if (test.status === "failed") {
        report.failed++;
        for (const msg of test.failureMessages ?? []) {
          // Trim verbose stack traces — keep first meaningful line
          const firstLine = msg.split("\n").find((l) => l.trim()) ?? msg;
          report.violations.push(firstLine.slice(0, 300).trim());
        }
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totalAxeTests,
    components: byComponent,
  };
}

const results = run();
writeFileSync(OUT_PATH, JSON.stringify(results, null, 2) + "\n");

const tested = Object.keys(results.components).length;
const failed = Object.values(results.components).filter((c) => c.failed > 0).length;

console.log(`\nA11y audit complete:`);
console.log(`  Total axe tests: ${results.totalAxeTests}`);
console.log(`  Components tested: ${tested}`);
console.log(`  Components with violations: ${failed}`);
if (failed > 0) {
  Object.values(results.components)
    .filter((c) => c.failed > 0)
    .forEach((c) => console.log(`  ⚠ ${c.component}: ${c.failed} failing axe test(s)`));
}
console.log(`  Wrote ${OUT_PATH}`);
