 import { render, screen } from "@testing-library/react";
  import { Box } from "./Box";

  describe("Box — rendering", () => {
    it("renders as a div by default", () => {
      const { container } = render(<Box>content</Box>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renders as a custom element via as prop", () => {
      const { container } = render(<Box as="section">content</Box>);
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("renders as main", () => {
      const { container } = render(<Box as="main">content</Box>);
      expect(container.firstChild?.nodeName).toBe("MAIN");
    });

    it("renders children", () => {
      render(<Box>hello</Box>);
      expect(screen.getByText("hello")).toBeInTheDocument();
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Box ref={ref}>content</Box>);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("Box — padding classes", () => {
    it("applies padding class", () => {
      const { container } = render(<Box padding={4}>content</Box>);
      expect(container.firstChild).toHaveClass("p-4");
    });

    it("applies paddingX class", () => {
      const { container } = render(<Box paddingX={6}>content</Box>);
      expect(container.firstChild).toHaveClass("px-6");
    });

    it("applies paddingY class", () => {
      const { container } = render(<Box paddingY={2}>content</Box>);
      expect(container.firstChild).toHaveClass("py-2");
    });

    it("applies padding=0 as p-0", () => {
      const { container } = render(<Box padding={0}>content</Box>);
      expect(container.firstChild).toHaveClass("p-0");
    });
  });

  describe("Box — margin classes", () => {
    it("applies margin class", () => {
      const { container } = render(<Box margin={4}>content</Box>);
      expect(container.firstChild).toHaveClass("m-4");
    });

    it("applies marginX class", () => {
      const { container } = render(<Box marginX={8}>content</Box>);
      expect(container.firstChild).toHaveClass("mx-8");
    });

    it("applies marginY class", () => {
      const { container } = render(<Box marginY={2}>content</Box>);
      expect(container.firstChild).toHaveClass("my-2");
    });
  });

  describe("Box — display classes", () => {
    it.each([
      ["block", "block"],
      ["flex", "flex"],
      ["grid", "grid"],
      ["inline", "inline"],
      ["inline-flex", "inline-flex"],
      ["hidden", "hidden"],
    ] as const)("applies display=%s", (display, expectedClass) => {
      const { container } = render(
        <Box display={display}>content</Box>
      );
      expect(container.firstChild).toHaveClass(expectedClass);
    });
  });

  describe("Box — className override", () => {
    it("merges consumer className", () => {
      const { container } = render(
        <Box padding={4} className="rounded-lg">content</Box>
      );
      expect(container.firstChild).toHaveClass("p-4");
      expect(container.firstChild).toHaveClass("rounded-lg");
    });

    it("consumer className overrides conflicting prop class", () => {
      const { container } = render(
        <Box padding={4} className="p-8">content</Box>
      );
      expect(container.firstChild).toHaveClass("p-8");
      expect(container.firstChild).not.toHaveClass("p-4");
    });
  });