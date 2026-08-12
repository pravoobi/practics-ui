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
  // ── Form ───────────────────────────────────────────────────────────────────

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

  Textarea: {
    description:
      "Labeled multi-line text input with helper text and error message. Same a11y wiring as Input.",
    category: "form",
    a11y: {
      radixPrimitives: [],
      guarantees: [
        "Label is associated with textarea via htmlFor/id.",
        "Helper and error text are linked via aria-describedby.",
        "aria-invalid is set when error is present.",
      ],
      requirements: [
        "Provide either a label prop or an explicit aria-label.",
      ],
    },
  },

  Checkbox: {
    description:
      "Accessible checkbox built on Radix UI with optional label, helper text, and error state.",
    category: "form",
    a11y: {
      radixPrimitives: ["@radix-ui/react-checkbox"],
      guarantees: [
        "Keyboard operable via Space key.",
        "Role 'checkbox' with aria-checked set by Radix.",
        "Associated label wired via htmlFor/id.",
        "aria-invalid and aria-describedby set when error is present.",
      ],
      requirements: [
        "Provide either a label prop or an explicit aria-label.",
      ],
    },
  },

  Select: {
    description:
      "Dropdown select built on Radix UI. Supports flat options and grouped option sets with disabled states.",
    category: "form",
    a11y: {
      radixPrimitives: ["@radix-ui/react-select"],
      guarantees: [
        "Keyboard navigation: Arrow keys move between options, Enter/Space selects.",
        "Role 'listbox' and 'option' set by Radix.",
        "Selected option announced to screen readers.",
        "Escape key closes the dropdown.",
      ],
      requirements: [
        "Provide an accessible label via a sibling <label> + htmlFor, or aria-label on the trigger.",
      ],
    },
    subcomponents: [
      "SelectTrigger",
      "SelectContent",
      "SelectItem",
      "SelectValue",
      "SelectGroup",
      "SelectLabel",
      "SelectSeparator",
    ],
  },

  // ── Layout ────────────────────────────────────────────────────────────────

  Box: {
    description:
      "Polymorphic layout primitive. Renders any HTML element via the 'as' prop with spacing scale props for padding and margin.",
    category: "layout",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "Use the 'as' prop to render a semantically appropriate element (section, article, main, aside) when context requires it.",
      ],
    },
  },

  Stack: {
    description:
      "Flex layout primitive for linear arrangements of children. Supports direction, gap, alignment, justification, and wrapping.",
    category: "layout",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "Use the 'as' prop for semantic elements when the stack represents a navigational list or section.",
      ],
    },
  },

  Grid: {
    description:
      "CSS Grid layout primitive with column/row counts and gap control via design-scale values.",
    category: "layout",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "Grid is purely visual layout — ensure reading order of children matches DOM order.",
      ],
    },
  },

  Container: {
    description:
      "Centered max-width wrapper with five named size presets (sm → full). Polymorphic via 'as'.",
    category: "layout",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [],
    },
  },

  PageHeader: {
    description:
      "Page-level header with eyebrow text, title, and an optional primary action button.",
    category: "layout",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "Ensure the title renders as the correct heading level for the page hierarchy (wrap in an h1/h2 if needed).",
        "The action button is a native <button>; provide a descriptive label.",
      ],
    },
  },

  Sidebar: {
    description:
      "Application sidebar with header, scrollable content, footer, nav groups, and nav items. Supports mobile drawer mode.",
    category: "navigation",
    a11y: {
      radixPrimitives: [],
      guarantees: [
        "NavItem renders as an anchor element.",
        "Active item is conveyed visually; use aria-current='page' for screen readers.",
      ],
      requirements: [
        "Wrap the Sidebar in a <nav> landmark or provide aria-label='Main navigation'.",
        "Set aria-current='page' (via isActive) on the current route's NavItem.",
        "For mobile drawer mode, manage focus — move focus inside when opened, return on close.",
      ],
    },
    subcomponents: [
      "SidebarHeader",
      "SidebarContent",
      "SidebarFooter",
      "SidebarNav",
      "NavItem",
      "NavGroup",
    ],
  },

  // ── Feedback ─────────────────────────────────────────────────────────────

  Alert: {
    description:
      "Static alert banner with five severity variants. Composed of Alert, AlertTitle, and AlertDescription.",
    category: "feedback",
    a11y: {
      radixPrimitives: [],
      guarantees: [
        "Renders as a <div> with role='alert' for immediate announcement.",
      ],
      requirements: [
        "For dynamic alerts injected after page load, role='alert' triggers a live-region announcement automatically.",
        "For static alerts present on initial render, consider role='status' instead to avoid premature announcements.",
        "Always include AlertTitle for context; AlertDescription is optional but recommended.",
      ],
    },
    subcomponents: ["AlertTitle", "AlertDescription"],
  },

  Toast: {
    description:
      "Notification toast system built on Radix UI. Exposes a useToast hook and toast() helper for imperative triggering. Supports five variants and six position presets.",
    category: "feedback",
    a11y: {
      radixPrimitives: ["@radix-ui/react-toast"],
      guarantees: [
        "Toasts are announced by screen readers via an aria-live region.",
        "Radix manages the live region — no manual ARIA needed.",
        "Keyboard users can focus and dismiss toasts.",
      ],
      requirements: [
        "Place <Toaster /> once at the app root, not per-page.",
        "Keep toast messages brief and actionable.",
        "Do not use toasts as the only means to convey critical errors — supplement with inline validation.",
      ],
    },
    subcomponents: ["Toaster"],
  },

  Progress: {
    description:
      "Progress bar with four color variants and three size presets. Supports optional visible label and numeric value.",
    category: "feedback",
    a11y: {
      radixPrimitives: [],
      guarantees: [
        "Renders as a div with role='progressbar'.",
        "aria-valuenow, aria-valuemin (0), and aria-valuemax (100) set from the value prop.",
      ],
      requirements: [
        "Provide a label prop or aria-label so screen readers can identify what is progressing.",
      ],
    },
  },

  EmptyState: {
    description:
      "Zero-state placeholder with optional icon, title, description, and a single call-to-action.",
    category: "feedback",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "title is required — it must describe the empty state meaningfully.",
        "If the action replaces in-page navigation, ensure the onClick handler is keyboard-accessible.",
      ],
    },
  },

  // ── Display ────────────────────────────────────────────────────────────────

  Card: {
    description:
      "Composable card container with Header, Title, Description, Content, and Footer sub-components. Supports three style variants.",
    category: "display",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "Use CardTitle inside a semantically appropriate heading element (h2/h3) when cards appear in a list.",
        "For interactive cards (clickable), use a wrapping <a> or <button> rather than an onClick on Card.",
      ],
    },
    subcomponents: [
      "CardHeader",
      "CardTitle",
      "CardDescription",
      "CardContent",
      "CardFooter",
    ],
  },

  Badge: {
    description:
      "Inline status badge with six color variants including success and warning.",
    category: "display",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "Badge is decorative text — ensure adjacent context conveys the same status for screen readers if the color is the only differentiator.",
        "For status badges that change dynamically, wrap in an aria-live region.",
      ],
    },
  },

  Avatar: {
    description:
      "User avatar with image, text fallback, and five size presets. Built on Radix UI Avatar.",
    category: "display",
    a11y: {
      radixPrimitives: ["@radix-ui/react-avatar"],
      guarantees: [
        "Falls back gracefully from image → initials when image fails to load.",
        "Radix manages the image/fallback swap without layout shift.",
      ],
      requirements: [
        "Provide alt text when the image conveys meaningful identity (e.g. user photo in a profile).",
        "For purely decorative avatars (e.g. in a list with a name alongside), use alt='' to mark as presentational.",
      ],
    },
  },

  StatCard: {
    description:
      "KPI stat card showing a metric label, value, optional change percentage with trend indicator, and optional icon.",
    category: "display",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "label and value are required — both are exposed as visible text.",
        "Trend icons are decorative — ensure the change text alone conveys the direction (e.g. '+12%' rather than relying on arrow color).",
      ],
    },
  },

  Breadcrumb: {
    description:
      "Breadcrumb navigation trail built from an items array. Supports custom separator and automatic collapsing via maxItems.",
    category: "navigation",
    a11y: {
      radixPrimitives: [],
      guarantees: [
        "Renders inside a <nav> with aria-label='breadcrumb'.",
        "Current page item has aria-current='page'.",
        "Separator elements are aria-hidden.",
      ],
      requirements: [
        "Provide href for all items except the current page (last item).",
        "Keep item labels concise — they are read in sequence by screen readers.",
      ],
    },
  },

  // ── Navigation ────────────────────────────────────────────────────────────

  Tabs: {
    description:
      "Tabbed content switcher built on Radix UI. Accepts either a data-driven items array or fully manual composition.",
    category: "navigation",
    a11y: {
      radixPrimitives: ["@radix-ui/react-tabs"],
      guarantees: [
        "Role 'tablist', 'tab', and 'tabpanel' set by Radix.",
        "Arrow key navigation between tabs.",
        "aria-selected and aria-controls wired automatically.",
        "Focus management handled by Radix.",
      ],
      requirements: [
        "Ensure tab labels are unique and descriptive.",
        "Do not put interactive controls inside tab panels that would conflict with arrow-key navigation.",
      ],
    },
    subcomponents: ["TabsList", "TabsTrigger", "TabsContent"],
  },

  // ── Overlay ───────────────────────────────────────────────────────────────

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

  ConfirmDialog: {
    description:
      "Pre-built confirmation dialog with title, description, confirm/cancel buttons, loading state, and a destructive variant. Controlled-only (requires open + onOpenChange).",
    category: "overlay",
    a11y: {
      radixPrimitives: ["@radix-ui/react-dialog"],
      guarantees: [
        "Inherits all Dialog a11y guarantees: focus trap, Escape key, aria-modal.",
        "loading=true disables confirm button and shows spinner.",
      ],
      requirements: [
        "title and description are required — they become the accessible name and description of the dialog.",
        "Use variant='destructive' for irreversible actions to signal danger visually.",
      ],
    },
  },

  // ── Data ──────────────────────────────────────────────────────────────────

  Table: {
    description:
      "Data table built on TanStack Table v8. Table provides a static view; DataTable adds client-side sorting. Both accept a columns definition and a data array.",
    category: "data",
    peerRequirements: ["@tanstack/react-table"],
    a11y: {
      radixPrimitives: [],
      guarantees: [
        "Renders a semantic <table> element with <thead>, <tbody>.",
        "Sortable column headers use <button> inside <th>.",
      ],
      requirements: [
        "Provide a caption prop — it becomes the accessible table name read by screen readers.",
        "Column headers (ColumnDef.header) must be descriptive strings or accessible ReactNodes.",
        "For complex cell renderers, ensure cell content has accessible text.",
      ],
    },
    subcomponents: ["DataTable"],
  },

  // ── Charts ────────────────────────────────────────────────────────────────

  DonutChart: {
    description:
      "SVG donut chart with optional center text, subtext, and legend. Renders segments from a data array with explicit colors.",
    category: "charts",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "SVG charts are not accessible by default — provide a visually hidden <table> or aria-label describing the data as a text alternative.",
        "showLegend=true improves comprehension but is not a substitute for text alternatives.",
        "Segment colors must meet 3:1 contrast ratio against the background to distinguish between segments.",
      ],
    },
  },

  AreaChart: {
    description:
      "SVG area chart supporting single and multi-series data. Configurable height, grid lines, and legend.",
    category: "charts",
    a11y: {
      radixPrimitives: [],
      guarantees: [],
      requirements: [
        "SVG charts are not accessible by default — provide a visually hidden data table or aria-label as a text alternative.",
        "Series colors must be distinguishable without relying on color alone (pair with patterns or labels for color-blind users).",
        "showLegend=true helps sighted users but add sr-only text for screen reader users too.",
      ],
    },
  },
};
