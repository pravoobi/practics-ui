 import { render, screen } from "@testing-library/react";
  import { Grid } from "./Grid";

  describe("Grid — rendering", () => {
    it("renders as a div by default", () => {
      const { container } = render(<Grid>content</Grid>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renders as a custom element via as prop", () => {
      const { container } = render(<Grid as="section">content</Grid>);
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("renders children", () => {
      render(
        <Grid>
          <span>one</span>
          <span>two</span>
        </Grid>
      );
      expect(screen.getByText("one")).toBeInTheDocument();
      expect(screen.getByText("two")).toBeInTheDocument();
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Grid ref={ref}>content</Grid>);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("Grid — grid class", () => {
    it("always applies grid class", () => {
      const { container } = render(<Grid>content</Grid>);
      expect(container.firstChild).toHaveClass("grid");
    });

    it("applies no cols class when cols is not set", () => {
      const { container } = render(<Grid>content</Grid>);
      expect(container.firstChild).not.toHaveClass("grid-cols-1");
    });
  });

  describe("Grid — cols classes", () => {
    it.each([1, 2, 3, 4, 6, 12] as const)(
      "applies grid-cols-%i",
      (cols) => {
        const { container } = render(<Grid cols={cols}>content</Grid>);
        expect(container.firstChild).toHaveClass(`grid-cols-${cols}`);
      }
    );
  });

  describe("Grid — rows classes", () => {
    it.each([1, 2, 3, 6] as const)(
      "applies grid-rows-%i",
      (rows) => {
        const { container } = render(<Grid rows={rows}>content</Grid>);
        expect(container.firstChild).toHaveClass(`grid-rows-${rows}`);
      }
    );
  });

  describe("Grid — gap classes", () => {
    it("applies gap class", () => {
      const { container } = render(<Grid gap={4}>content</Grid>);
      expect(container.firstChild).toHaveClass("gap-4");
    });

    it("applies gap=0 as gap-0", () => {
      const { container } = render(<Grid gap={0}>content</Grid>);
      expect(container.firstChild).toHaveClass("gap-0");
    });

    it("applies gapX class", () => {
      const { container } = render(<Grid gapX={6}>content</Grid>);
      expect(container.firstChild).toHaveClass("gap-x-6");
    });

    it("applies gapY class", () => {
      const { container } = render(<Grid gapY={2}>content</Grid>);
      expect(container.firstChild).toHaveClass("gap-y-2");
    });

    it("applies gapX and gapY independently", () => {
      const { container } = render(<Grid gapX={8} gapY={2}>content</Grid>);
      expect(container.firstChild).toHaveClass("gap-x-8");
      expect(container.firstChild).toHaveClass("gap-y-2");
    });
  });

  describe("Grid — Box props passthrough", () => {
    it("applies padding from Box props", () => {
      const { container } = render(<Grid padding={4}>content</Grid>);
      expect(container.firstChild).toHaveClass("p-4");
    });

    it("merges consumer className", () => {
      const { container } = render(
        <Grid className="rounded-lg">content</Grid>
      );
      expect(container.firstChild).toHaveClass("rounded-lg");
      expect(container.firstChild).toHaveClass("grid");
    });
  });