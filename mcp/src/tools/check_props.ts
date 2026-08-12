import { z } from "zod";
import { getComponent } from "../data.js";

export const checkPropsInputSchema = z.object({
  name: z.string().describe("Component name or slug"),
  props: z
    .record(z.string(), z.unknown())
    .describe(
      "The props you intend to pass. Keys are prop names, values are the intended values."
    ),
});

export type CheckPropsInput = z.infer<typeof checkPropsInputSchema>;

type Issue = { severity: "error" | "warning"; prop: string; message: string };

export function checkProps({ name, props }: CheckPropsInput) {
  const comp = getComponent(name);
  if (!comp) {
    return {
      error: `Component '${name}' not found. Use list_components to see available components.`,
    };
  }

  const issues: Issue[] = [];

  const knownProps = new Set(comp.props.map((p) => p.name));
  // Also include spread props like ...HTMLButtonAttributes — they pass through
  const hasSpreads = comp.props.some((p) => p.name.startsWith("...HTML"));

  // 1. Required prop check
  for (const p of comp.props) {
    if (p.required && p.name !== "ref" && !(p.name in props)) {
      issues.push({
        severity: "error",
        prop: p.name,
        message: `Required prop '${p.name}' (${p.type}) is missing.`,
      });
    }
  }

  // 2. Unknown props
  for (const key of Object.keys(props)) {
    if (!knownProps.has(key) && !hasSpreads) {
      issues.push({
        severity: "warning",
        prop: key,
        message: `'${key}' is not a declared prop on ${comp.name}. It may be passed through if the component spreads HTML attributes.`,
      });
    }
  }

  // 3. Enum / variant value check
  for (const variant of comp.variants) {
    const supplied = props[variant.prop];
    if (supplied !== undefined) {
      const valid = variant.values;
      if (!valid.includes(String(supplied))) {
        issues.push({
          severity: "error",
          prop: variant.prop,
          message: `Invalid value '${supplied}' for '${variant.prop}'. Valid values: ${valid.map((v) => `'${v}'`).join(", ")}.`,
        });
      }
    }
  }

  // 4. Deprecated props
  for (const p of comp.props) {
    if (p.deprecated && p.name in props) {
      issues.push({
        severity: "warning",
        prop: p.name,
        message: `Prop '${p.name}' is deprecated. ${p.deprecated}`,
      });
    }
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  return {
    component: comp.name,
    valid: errors.length === 0,
    summary:
      errors.length === 0 && warnings.length === 0
        ? "Props look valid."
        : `${errors.length} error(s), ${warnings.length} warning(s).`,
    errors,
    warnings,
    checkedProps: Object.keys(props),
  };
}
