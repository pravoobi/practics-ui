 import * as React from "react";
  import { render, screen, waitFor, act } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { axe } from "vitest-axe";
  import { Checkbox } from "./Checkbox";

  const AXE_CONFIG = {
    rules: { "color-contrast": { enabled: false } },
  };

  // --- Rendering ---
  describe("Checkbox — rendering", () => {
    it("renders with a label", () => {
      render(<Checkbox label="Accept terms" />);
      expect(
        screen.getByRole("checkbox", { name: "Accept terms" })
      ).toBeInTheDocument();
    });

    it("label is associated with the checkbox", () => {
      render(<Checkbox label="Accept terms" />);
      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
      expect(checkbox).toHaveAttribute("id");
      expect(
        screen.getByText("Accept terms").closest("label")
      ).toHaveAttribute("for", checkbox.id);
    });

    it("renders unchecked by default", () => {
      render(<Checkbox label="Accept terms" />);
      expect(
        screen.getByRole("checkbox", { name: "Accept terms" })
      ).not.toBeChecked();
    });

    it("forwards ref to the DOM element", () => {
      const ref = { current: null };
      render(<Checkbox label="Accept terms" ref={ref} />);
      expect(ref.current).not.toBeNull();
    });

    it("renders without a label using aria-label", () => {
      render(<Checkbox aria-label="Accept terms" />);
      expect(
        screen.getByRole("checkbox", { name: "Accept terms" })
      ).toBeInTheDocument();
    });
  });

  // --- Helper text ---
  describe("Checkbox — helperText", () => {
    it("renders helper text", () => {
      render(
        <Checkbox label="Accept terms" helperText="Required to continue." />
      );
      expect(screen.getByText("Required to continue.")).toBeInTheDocument();
    });

    it("hides helper text when error is present", () => {
      render(
        <Checkbox
          label="Accept terms"
          helperText="Required to continue."
          error="You must accept the terms."
        />
      );
      expect(
        screen.queryByText("Required to continue.")
      ).not.toBeInTheDocument();
    });
  });

  // --- Error state ---
  describe("Checkbox — error", () => {
    it("renders error message", () => {
      render(
        <Checkbox label="Accept terms" error="You must accept the terms." />
      );
      expect(
        screen.getByText("You must accept the terms.")
      ).toBeInTheDocument();
    });

    it("sets aria-invalid when error is present", () => {
      render(
        <Checkbox label="Accept terms" error="You must accept the terms." />
      );
      expect(
        screen.getByRole("checkbox", { name: "Accept terms" })
      ).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-describedby pointing to error message", () => {
      render(
        <Checkbox label="Accept terms" error="You must accept the terms." />
      );
      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
      const errorId = checkbox.getAttribute("aria-describedby");
      expect(document.getElementById(errorId!)).toHaveTextContent(
        "You must accept the terms."
      );
    });
  });

  // --- Interaction ---
  describe("Checkbox — interaction", () => {
    it("toggles on click", async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept terms" />);
      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("calls onCheckedChange when toggled", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />
      );
      await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("toggles on Space key", async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept terms" />);
      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
      checkbox.focus();
      await user.keyboard(" ");
      expect(checkbox).toBeChecked();
    });

    it("does not toggle when disabled", async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept terms" disabled />);
      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("clicking label toggles the checkbox", async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept terms" />);
      await user.click(screen.getByText("Accept terms"));
      expect(
        screen.getByRole("checkbox", { name: "Accept terms" })
      ).toBeChecked();
    });
  });

  // --- Async state transitions ---
  describe("Checkbox — async", () => {
    it("shows error after state update", async () => {
      let setError!: (v: string) => void;
      const Wrapper = () => {
        const [error, setE] = React.useState("");
        setError = setE;
        return (
          <Checkbox label="Accept terms" error={error || undefined} />
        );
      };
      render(<Wrapper />);
      expect(
        screen.queryByText("You must accept the terms.")
      ).not.toBeInTheDocument();
      act(() => setError("You must accept the terms."));
      await waitFor(() =>
        expect(
          screen.getByText("You must accept the terms.")
        ).toBeInTheDocument()
      );
    });
  });

  // --- Accessibility ---
  describe("Checkbox — accessibility", () => {
    it("passes axe audit with label", async () => {
      const { container } = render(<Checkbox label="Accept terms" />);
      expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
    });

    it("passes axe audit with error", async () => {
      const { container } = render(
        <Checkbox label="Accept terms" error="You must accept the terms." />
      );
      expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
    });

    it("checkbox without label or aria-label fails axe audit", async () => {
      const { container } = render(<Checkbox />);
      const results = await axe(container, AXE_CONFIG);
      expect(results.violations.length).toBeGreaterThan(0);
    });
  });