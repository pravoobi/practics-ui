 import { render } from "@testing-library/react";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from "./card";

  describe("Card — rendering", () => {
    it("renders a div", () => {
      const { container } = render(<Card>content</Card>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Card ref={ref}>content</Card>);
      expect(ref.current).not.toBeNull();
    });

    it("merges consumer className", () => {
      const { container } = render(<Card className="custom-class">content</Card>);
      expect(container.firstChild).toHaveClass("custom-class");
      expect(container.firstChild).toHaveClass("rounded-lg");
    });
  });

  describe("Card — base classes", () => {
    it("applies border and background classes", () => {
      const { container } = render(<Card>content</Card>);
      expect(container.firstChild).toHaveClass("rounded-lg");
      expect(container.firstChild).toHaveClass("border");
      expect(container.firstChild).toHaveClass("shadow-sm");
    });
  });

  describe("CardHeader", () => {
    it("renders a div", () => {
      const { container } = render(<CardHeader>content</CardHeader>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("applies flex column layout", () => {
      const { container } = render(<CardHeader>content</CardHeader>);
      expect(container.firstChild).toHaveClass("flex");
      expect(container.firstChild).toHaveClass("flex-col");
      expect(container.firstChild).toHaveClass("p-6");
    });
  });

  describe("CardTitle", () => {
    it("renders an h3", () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      expect(container.firstChild?.nodeName).toBe("H3");
    });

    it("applies heading classes", () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      expect(container.firstChild).toHaveClass("font-semibold");
    });
  });

  describe("CardDescription", () => {
    it("renders a p", () => {
      const { container } = render(<CardDescription>desc</CardDescription>);
      expect(container.firstChild?.nodeName).toBe("P");
    });

    it("applies muted text class", () => {
      const { container } = render(<CardDescription>desc</CardDescription>);
      expect(container.firstChild).toHaveClass("text-muted-foreground");
    });
  });

  describe("CardContent", () => {
    it("applies padding without top padding", () => {
      const { container } = render(<CardContent>content</CardContent>);
      expect(container.firstChild).toHaveClass("p-6");
      expect(container.firstChild).toHaveClass("pt-0");
    });
  });

  describe("CardFooter", () => {
    it("renders with flex and alignment", () => {
      const { container } = render(<CardFooter>footer</CardFooter>);
      expect(container.firstChild).toHaveClass("flex");
      expect(container.firstChild).toHaveClass("items-center");
    });
  });

  describe("Card — composition", () => {
    it("renders full card structure", () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>My Card</CardTitle>
            <CardDescription>A description</CardDescription>
          </CardHeader>
          <CardContent>Body text</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );
      expect(getByText("My Card")).toBeTruthy();
      expect(getByText("A description")).toBeTruthy();
      expect(getByText("Body text")).toBeTruthy();
    });
  });