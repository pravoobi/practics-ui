 import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { axe } from "vitest-axe";
  import { Checkbox } from "./checkbox";

  const AXE_CONFIG = {
    rules: { "color-contrast": { enabled: false } },
  };

  describe("UI Checkbox — rendering", () => {
    it("renders a checkbox", () => {
      render(<Checkbox aria-label="accept" />);
      expect(
        screen.getByRole("checkbox", { name: "accept" })
      ).toBeInTheDocument();
    });

    it("renders unchecked by default", () => {
      render(<Checkbox aria-label="accept" />);
      expect(
        screen.getByRole("checkbox", { name: "accept" })
      ).not.toBeChecked();
    });

    it("renders checked when defaultChecked is passed", () => {
      render(<Checkbox aria-label="accept" defaultChecked />);
      expect(
        screen.getByRole("checkbox", { name: "accept" })
      ).toBeChecked();
    });

    it("renders as disabled", () => {
      render(<Checkbox aria-label="accept" disabled />);
      expect(
        screen.getByRole("checkbox", { name: "accept" })
      ).toBeDisabled();
    });

    it("forwards ref to the DOM element", () => {
      const ref = { current: null };
      render(<Checkbox aria-label="accept" ref={ref} />);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("UI Checkbox — interaction", () => {
    it("toggles checked state on click", async () => {
      const user = userEvent.setup();
      render(<Checkbox aria-label="accept" />);
      const checkbox = screen.getByRole("checkbox", { name: "accept" });
      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("calls onCheckedChange when toggled", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Checkbox aria-label="accept" onCheckedChange={onCheckedChange} />);
      await user.click(screen.getByRole("checkbox", { name: "accept" }));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("does not toggle when disabled", async () => {
      const user = userEvent.setup();
      render(<Checkbox aria-label="accept" disabled />);
      const checkbox = screen.getByRole("checkbox", { name: "accept" });
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("UI Checkbox — accessibility", () => {
    it("passes axe audit when labelled", async () => {
      const { container } = render(<Checkbox aria-label="accept" />);
      expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
    });

    it("checkbox without label fails axe audit", async () => {
      const { container } = render(<Checkbox />);
      const results = await axe(container, AXE_CONFIG);
      expect(results.violations.length).toBeGreaterThan(0);
    });
  });