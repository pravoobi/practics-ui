import { render } from "@testing-library/react";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from "./Card";

  describe("Card — variants", () => {
    it("renders default variant without extra classes", () => {
      const { container } = render(<Card>content</Card>);
      expect(container.firstChild).toHaveClass("rounded-lg");
      expect(container.firstChild).not.toHaveClass("border-2");
      expect(container.firstChild).not.toHaveClass("bg-transparent");
    });

    it("applies outline variant classes", () => {
      const { container } = render(<Card variant="outline">content</Card>);
      expect(container.firstChild).toHaveClass("border-2");
      expect(container.firstChild).toHaveClass("shadow-none");
    });

    it("applies ghost variant classes", () => {
      const { container } = render(<Card variant="ghost">content</Card>);
      expect(container.firstChild).toHaveClass("bg-transparent");
      expect(container.firstChild).toHaveClass("shadow-none");
      expect(container.firstChild).toHaveClass("border-transparent");
    });

    it("merges consumer className with variant", () => {
      const { container } = render(
        <Card variant="outline" className="mt-4">content</Card>
      );
      expect(container.firstChild).toHaveClass("border-2");
      expect(container.firstChild).toHaveClass("mt-4");
    });
  });

  describe("Card — ref forwarding", () => {
    it("forwards ref on Card", () => {
      const ref = { current: null };
      render(<Card ref={ref}>content</Card>);
      expect(ref.current).not.toBeNull();
    });

    it("forwards ref on CardTitle", () => {
      const ref = { current: null };
      render(<CardTitle ref={ref}>Title</CardTitle>);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("CardContent — padding prop", () => {
    it("applies padding class when padding prop is set", () => {
      const { container } = render(<CardContent padding={4}>content</CardContent>);
      expect(container.firstChild).toHaveClass("p-4");
    });

    it("applies padding class when padding is 0", () => {
      const { container } = render(<CardContent padding={0}>content</CardContent>);
      expect(container.firstChild).toHaveClass("p-0");
    });

    it("does not apply padding class when padding is omitted", () => {
      const { container } = render(<CardContent>content</CardContent>);
      expect(container.firstChild).not.toHaveClass("p-0");
      expect(container.firstChild).not.toHaveClass("p-4");
    });
  });

  describe("Card — composition", () => {
    it("renders full card without errors", () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Body</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );
      expect(getByText("Title")).toBeTruthy();
      expect(getByText("Description")).toBeTruthy();
      expect(getByText("Body")).toBeTruthy();
      expect(getByText("Footer")).toBeTruthy();
    });
  });