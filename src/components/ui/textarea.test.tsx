import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Textarea } from "./textarea";

const AXE_CONFIG = {
  rules: { "color-contrast": { enabled: false } },
};

describe("UI Textarea — rendering", () => {
  it("renders a textarea element", () => {
    render(<Textarea aria-label="message" />);
    expect(
      screen.getByRole("textbox", { name: "message" }),
    ).toBeInTheDocument();
  });

  it("accepts a placeholder", () => {
    render(<Textarea placeholder="Enter message" aria-label="message" />);
    expect(screen.getByPlaceholderText("Enter message")).toBeInTheDocument();
  });

  it("renders as disabled", () => {
    render(<Textarea aria-label="message" disabled />);
    expect(screen.getByRole("textbox", { name: "message" })).toBeDisabled();
  });

  it("accepts rows prop", () => {
    render(<Textarea aria-label="message" rows={6} />);
    expect(screen.getByRole("textbox", { name: "message" })).toHaveAttribute(
      "rows",
      "6",
    );
  });

  it("forwards ref to the DOM textarea", () => {
    const ref = { current: null };
    render(<Textarea aria-label="message" ref={ref} />);
    expect(ref.current).not.toBeNull();
  });
});

describe("UI Textarea — accessibility", () => {
  it("passes axe audit when labelled", async () => {
    const { container } = render(<Textarea aria-label="message" />);
    expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
  });

  it("textarea without label fails axe audit", async () => {
    const { container } = render(<Textarea />);
    const results = await axe(container, AXE_CONFIG);
    expect(results.violations.length).toBeGreaterThan(0);
  });
});
