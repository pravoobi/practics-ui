import { z } from "zod";
import { getComponent } from "../data.js";

export const getA11yRequirementsInputSchema = z.object({
  name: z.string().describe("Component name or slug"),
});

export type GetA11yRequirementsInput = z.infer<typeof getA11yRequirementsInputSchema>;

export function getA11yRequirements({ name }: GetA11yRequirementsInput) {
  const comp = getComponent(name);
  if (!comp) {
    return {
      error: `Component '${name}' not found. Use list_components to see available components.`,
    };
  }

  const { a11y } = comp;
  const axeReport = a11y.axeReport;

  return {
    component: comp.name,
    radixPrimitives: a11y.radixPrimitives,
    guarantees: a11y.guarantees,
    requirements: a11y.requirements,
    axeReport: axeReport
      ? {
          tested: axeReport.tested,
          passed: axeReport.passed,
          failed: axeReport.failed,
          violations: axeReport.violations,
          runAt: axeReport.runAt,
          summary:
            axeReport.failed === 0
              ? `All ${axeReport.passed} axe test(s) passing.`
              : `${axeReport.failed} axe violation(s) detected out of ${axeReport.passed + axeReport.failed} test(s).`,
        }
      : null,
  };
}
