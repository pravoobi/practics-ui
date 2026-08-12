/**
 * Curated per-component metadata that cannot be reliably inferred from source.
 * Keep entries minimal and factual; prose descriptions belong in TSDoc.
 */

export type Override = {
  description: string;
  category: string;
  a11y: {
    radixPrimitives: string[];
    guarantees: string[];
    requirements: string[];
  };
  peerRequirements?: string[];
  subcomponents?: string[];
};

export const OVERRIDES: Record<string, Override> = {
  Button: {
    description:
      "Clickable button with icon slots and a loading state. Wraps a shadcn base with CVA variants.",
    category: "form",
    a11y: {
      radixPrimitives: [],
      guarantees: [
        "Uses a native <button> element by default (asChild swaps the render element).",
        "Icons rendered inside are marked aria-hidden.",
        "loading=true sets aria-busy and disables interaction.",
      ],
      requirements: [
        "Provide accessible content: children text OR aria-label when using icon-only sizes.",
        "When size='icon', an aria-label is required.",
      ],
    },
  },
  Input: {
    description:
      "Labeled text input with optional icons, helper text and error message. Wires aria-describedby and aria-invalid automatically.",
    category: "form",
    a11y: {
      radixPrimitives: [],
      guarantees: [
        "Label is associated with input via htmlFor/id.",
        "Helper text and error text are linked via aria-describedby.",
        "aria-invalid is set when error is present.",
        "Decorative icons are marked aria-hidden.",
      ],
      requirements: [
        "Provide either a label prop or an explicit aria-label.",
        "Prefer error text over placeholder for validation messages.",
      ],
    },
  },
  Dialog: {
    description:
      "Modal dialog primitive composed of Root, Trigger, Content, Header, Footer, Title, Description, and Close. Supports controlled and uncontrolled modes.",
    category: "overlay",
    a11y: {
      radixPrimitives: ["@radix-ui/react-dialog"],
      guarantees: [
        "Focus is trapped inside the dialog while open.",
        "Escape key closes the dialog.",
        "Body scroll is locked while the dialog is open.",
        "role='dialog' and aria-modal='true' set by Radix.",
        "Focus returns to the trigger on close.",
      ],
      requirements: [
        "DialogContent must contain a DialogTitle (Radix requirement; violates a11y otherwise).",
        "Provide a DialogDescription or explicit aria-describedby on DialogContent.",
        "Use DialogTrigger asChild when wrapping a custom button.",
      ],
    },
    subcomponents: [
      "DialogTrigger",
      "DialogClose",
      "DialogContent",
      "DialogHeader",
      "DialogFooter",
      "DialogTitle",
      "DialogDescription",
    ],
  },
};
