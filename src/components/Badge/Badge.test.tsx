 import { render } from "@testing-library/react";
  import { Badge } from "./Badge";

  describe("Badge — default variant", () => {
    it("renders a div", () => {
      const { container } = render(<Badge>label</Badge>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Badge ref={ref}>label</Badge>);
      expect(ref.current).not.toBeNull();
    });

    it("applies base classes", () => {
      const { container } = render(<Badge>label</Badge>);
      expect(container.firstChild).toHaveClass("rounded-full");
      expect(container.firstChild).toHaveClass("text-xs");
    });

    it("merges consumer className", () => {
      const { container } = render(<Badge className="mt-2">label</Badge>);
      expect(container.firstChild).toHaveClass("mt-2");
      expect(container.firstChild).toHaveClass("rounded-full");
    });
  });

  describe("Badge — UI layer variants", () => {
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

  describe("Badge — product layer variants", () => {
    it("applies success variant classes", () => {
      const { container } = render(<Badge variant="success">label</Badge>);
      expect(container.firstChild).toHaveClass("bg-green-500");
      expect(container.firstChild).toHaveClass("text-white");
    });

    it("applies warning variant classes", () => {
      const { container } = render(<Badge variant="warning">label</Badge>);
      expect(container.firstChild).toHaveClass("bg-yellow-500");
      expect(container.firstChild).toHaveClass("text-white");
    });

    it("merges consumer className on success variant", () => {
      const { container } = render(
        <Badge variant="success" className="uppercase">label</Badge>
      );
      expect(container.firstChild).toHaveClass("bg-green-500");
      expect(container.firstChild).toHaveClass("uppercase");
    });
  });