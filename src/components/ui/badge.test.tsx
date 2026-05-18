import { render } from "@testing-library/react";
  import { Badge } from "./badge";

  describe("Badge — rendering", () => {
    it("renders a div", () => {
      const { container } = render(<Badge>New</Badge>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Badge ref={ref}>New</Badge>);
      expect(ref.current).not.toBeNull();
    });

    it("renders children", () => {
      const { getByText } = render(<Badge>New</Badge>);
      expect(getByText("New")).toBeTruthy();
    });

    it("merges consumer className", () => {
      const { container } = render(<Badge className="mt-2">New</Badge>);
      expect(container.firstChild).toHaveClass("mt-2");
      expect(container.firstChild).toHaveClass("rounded-full");
    });
  });

  describe("Badge — base classes", () => {
    it("always applies base classes", () => {
      const { container } = render(<Badge>New</Badge>);
      expect(container.firstChild).toHaveClass("inline-flex");
      expect(container.firstChild).toHaveClass("rounded-full");
      expect(container.firstChild).toHaveClass("text-xs");
      expect(container.firstChild).toHaveClass("font-semibold");
    });
  });

  describe("Badge — variants", () => {
    it("applies default variant by default", () => {
      const { container } = render(<Badge>New</Badge>);
      expect(container.firstChild).toHaveClass("bg-primary");
      expect(container.firstChild).toHaveClass("text-primary-foreground");
    });

    it.each([
      ["default", "bg-primary"],
      ["secondary", "bg-secondary"],
      ["destructive", "bg-destructive"],
      ["outline", "border-border"],
    ] as const)("applies variant=%s", (variant, expectedClass) => {
      const { container } = render(<Badge variant={variant}>label</Badge>);
      expect(container.firstChild).toHaveClass(expectedClass);
    });
  });