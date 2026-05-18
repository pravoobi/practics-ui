import { render, screen } from "@testing-library/react";
  import { Stack } from "./Stack";

  describe("Stack — rendering", () => {
    it("renders as a div by default", () => {
      const { container } = render(<Stack>content</Stack>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renders as a custom element via as prop", () => {
      const { container } = render(<Stack as="nav">content</Stack>);
      expect(container.firstChild?.nodeName).toBe("NAV");
    });

    it("renders children", () => {
      render(
        <Stack>
          <span>one</span>
          <span>two</span>
        </Stack>
      );
      expect(screen.getByText("one")).toBeInTheDocument();
      expect(screen.getByText("two")).toBeInTheDocument();
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Stack ref={ref}>content</Stack>);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("Stack — flex classes", () => {
    it("always applies flex class", () => {
      const { container } = render(<Stack>content</Stack>);
      expect(container.firstChild).toHaveClass("flex");
    });

    it("applies flex-row by default", () => {
      const { container } = render(<Stack>content</Stack>);
      expect(container.firstChild).toHaveClass("flex-row");
    });

    it("applies flex-col for column direction", () => {
      const { container } = render(
        <Stack direction="column">content</Stack>
      );
      expect(container.firstChild).toHaveClass("flex-col");
    });

    it("applies flex-row-reverse", () => {
      const { container } = render(
        <Stack direction="row-reverse">content</Stack>
      );
      expect(container.firstChild).toHaveClass("flex-row-reverse");
    });

    it("applies flex-col-reverse", () => {
      const { container } = render(
        <Stack direction="column-reverse">content</Stack>
      );
      expect(container.firstChild).toHaveClass("flex-col-reverse");
    });
  });

  describe("Stack — gap classes", () => {
    it("applies gap class", () => {
      const { container } = render(<Stack gap={4}>content</Stack>);
      expect(container.firstChild).toHaveClass("gap-4");
    });

    it("applies gap=0 as gap-0", () => {
      const { container } = render(<Stack gap={0}>content</Stack>);
      expect(container.firstChild).toHaveClass("gap-0");
    });

    it("applies no gap class when gap is not set", () => {
      const { container } = render(<Stack>content</Stack>);
      expect(container.firstChild).not.toHaveClass("gap-0");
    });
  });

  describe("Stack — align classes", () => {
    it.each([
      ["start", "items-start"],
      ["center", "items-center"],
      ["end", "items-end"],
      ["stretch", "items-stretch"],
      ["baseline", "items-baseline"],
    ] as const)("applies align=%s", (align, expectedClass) => {
      const { container } = render(
        <Stack align={align}>content</Stack>
      );
      expect(container.firstChild).toHaveClass(expectedClass);
    });
  });

  describe("Stack — justify classes", () => {
    it.each([
      ["start", "justify-start"],
      ["center", "justify-center"],
      ["end", "justify-end"],
      ["between", "justify-between"],
      ["around", "justify-around"],
      ["evenly", "justify-evenly"],
    ] as const)("applies justify=%s", (justify, expectedClass) => {
      const { container } = render(
        <Stack justify={justify}>content</Stack>
      );
      expect(container.firstChild).toHaveClass(expectedClass);
    });
  });

  describe("Stack — wrap", () => {
    it("applies flex-wrap when wrap is true", () => {
      const { container } = render(<Stack wrap>content</Stack>);
      expect(container.firstChild).toHaveClass("flex-wrap");
    });

    it("does not apply flex-wrap by default", () => {
      const { container } = render(<Stack>content</Stack>);
      expect(container.firstChild).not.toHaveClass("flex-wrap");
    });
  });

  describe("Stack — Box props passthrough", () => {
    it("applies padding from Box props", () => {
      const { container } = render(<Stack padding={4}>content</Stack>);
      expect(container.firstChild).toHaveClass("p-4");
    });

    it("applies marginX from Box props", () => {
      const { container } = render(<Stack marginX={6}>content</Stack>);
      expect(container.firstChild).toHaveClass("mx-6");
    });

    it("merges consumer className", () => {
      const { container } = render(
        <Stack className="rounded-lg">content</Stack>
      );
      expect(container.firstChild).toHaveClass("rounded-lg");
      expect(container.firstChild).toHaveClass("flex");
    });
  });