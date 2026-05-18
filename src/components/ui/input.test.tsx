import { render, screen } from "@testing-library/react";
  import { axe } from "vitest-axe";
  import { Input } from "./input";

  const AXE_CONFIG = {
    rules: { "color-contrast": { enabled: false } },
  };

  describe("UI Input — rendering", () => {
    it("renders an input element", () => {
      render(<Input aria-label="email" />);
      expect(screen.getByRole("textbox", { name: "email" })).toBeInTheDocument();
    });

    it("accepts a placeholder", () => {
      render(<Input placeholder="Enter email" aria-label="email" />);
      expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    });

    it("renders as disabled", () => {
      render(<Input aria-label="email" disabled />);
      expect(screen.getByRole("textbox", { name: "email" })).toBeDisabled();
    });

    it("forwards ref to the DOM input", () => {
      const ref = { current: null };
      render(<Input aria-label="email" ref={ref} />);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("UI Input — types", () => {
    it("renders type=password", () => {
      render(<Input type="password" aria-label="password" />);
      expect(screen.getByLabelText("password")).toHaveAttribute(
        "type",
        "password"
      );
    });

    it("renders type=email", () => {
      render(<Input type="email" aria-label="email" />);
      expect(screen.getByRole("textbox", { name: "email" })).toHaveAttribute(
        "type",
        "email"
      );
    });
  });

  describe("UI Input — accessibility", () => {
    it("passes axe audit when labelled", async () => {
      const { container } = render(<Input aria-label="email" />);
      expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
    });

    it("input without label fails axe audit", async () => {
      const { container } = render(<Input />);
      const results = await axe(container, AXE_CONFIG);
      expect(results.violations.length).toBeGreaterThan(0);
    });
  });