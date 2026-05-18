 import { render } from "@testing-library/react";
  import { Container } from "./Container";

  describe("Container — rendering", () => {
    it("renders as a div by default", () => {
      const { container } = render(<Container>content</Container>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renders as a custom element via as prop", () => {
      const { container } = render(<Container as="main">content</Container>);
      expect(container.firstChild?.nodeName).toBe("MAIN");
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Container ref={ref}>content</Container>);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("Container — base classes", () => {
    it("always applies w-full and mx-auto", () => {
      const { container } = render(<Container>content</Container>);
      expect(container.firstChild).toHaveClass("w-full");
      expect(container.firstChild).toHaveClass("mx-auto");
    });
  });

  describe("Container — size classes", () => {
    it("applies max-w-screen-lg by default", () => {
      const { container } = render(<Container>content</Container>);
      expect(container.firstChild).toHaveClass("max-w-screen-lg");
    });

    it.each([
      ["sm", "max-w-screen-sm"],
      ["md", "max-w-screen-md"],
      ["lg", "max-w-screen-lg"],
      ["xl", "max-w-screen-xl"],
      ["full", "max-w-full"],
    ] as const)("applies size=%s", (size, expectedClass) => {
      const { container } = render(
        <Container size={size}>content</Container>
      );
      expect(container.firstChild).toHaveClass(expectedClass);
    });
  });

  describe("Container — Box props passthrough", () => {
    it("applies paddingX from Box props", () => {
      const { container } = render(
        <Container paddingX={6}>content</Container>
      );
      expect(container.firstChild).toHaveClass("px-6");
    });

    it("applies paddingY from Box props", () => {
      const { container } = render(
        <Container paddingY={4}>content</Container>
      );
      expect(container.firstChild).toHaveClass("py-4");
    });

    it("merges consumer className", () => {
      const { container } = render(
        <Container className="rounded-lg">content</Container>
      );
      expect(container.firstChild).toHaveClass("rounded-lg");
      expect(container.firstChild).toHaveClass("mx-auto");
    });

    it("consumer className can override size class", () => {
      const { container } = render(
        <Container size="lg" className="max-w-screen-sm">content</Container>
      );
      expect(container.firstChild).toHaveClass("max-w-screen-sm");
      expect(container.firstChild).not.toHaveClass("max-w-screen-lg");
    });
  });