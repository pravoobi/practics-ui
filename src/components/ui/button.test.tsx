import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Button } from "./button";

const AXE_CONFIG = {
  rules: { "color-contrast": { enabled: false } },
};

describe("UI Button — variants", () => {
  it.each([
    ["default"],
    ["destructive"],
    ["outline"],
    ["secondary"],
    ["ghost"],
    ["link"],
  ] as const)("renders variant=%s without crashing", (variant) => {
    render(<Button variant={variant}>Click</Button>);
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });
});

describe("UI Button — sizes", () => {
  it.each([["default"], ["sm"], ["lg"], ["icon"]] as const)(
    "renders size=%s without crashing",
    (size) => {
      render(<Button size={size}>S</Button>);
      expect(screen.getByRole("button", { name: "S" })).toBeInTheDocument();
    },
  );
});

describe("UI Button — disabled", () => {
  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole("button", { name: "Click" })).toBeDisabled();
  });
});

describe("UI Button — asChild", () => {
  it("renders as a child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });
});

describe("UI Button — accessibility", () => {
  it("passes axe audit", async () => {
    const { container } = render(<Button>Click</Button>);
    expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
  });
});
