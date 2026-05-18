import { render } from "@testing-library/react";
  import { Alert, AlertTitle, AlertDescription } from "./alert";

  describe("Alert — rendering", () => {
    it("renders a div with role=alert", () => {
      const { getByRole } = render(<Alert>content</Alert>);
      expect(getByRole("alert")).toBeTruthy();
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Alert ref={ref}>content</Alert>);
      expect(ref.current).not.toBeNull();
    });

    it("merges consumer className", () => {
      const { getByRole } = render(<Alert className="mt-4">content</Alert>);
      expect(getByRole("alert")).toHaveClass("mt-4");
      expect(getByRole("alert")).toHaveClass("rounded-lg");
    });
  });

  describe("Alert — variants", () => {
    it("applies default variant by default", () => {
      const { getByRole } = render(<Alert>content</Alert>);
      expect(getByRole("alert")).toHaveClass("bg-background");
      expect(getByRole("alert")).toHaveClass("text-foreground");
    });

    it("applies destructive variant", () => {
      const { getByRole } = render(
        <Alert variant="destructive">content</Alert>
      );
      expect(getByRole("alert")).toHaveClass("text-destructive");
    });
  });

  describe("AlertTitle", () => {
    it("renders an h5", () => {
      const { container } = render(<AlertTitle>Title</AlertTitle>);
      expect(container.firstChild?.nodeName).toBe("H5");
    });

    it("applies heading classes", () => {
      const { container } = render(<AlertTitle>Title</AlertTitle>);
      expect(container.firstChild).toHaveClass("font-medium");
    });
  });

  describe("AlertDescription", () => {
    it("renders a p", () => {
      const { container } = render(<AlertDescription>desc</AlertDescription>);
      expect(container.firstChild?.nodeName).toBe("P");
    });

    it("applies text-sm", () => {
      const { container } = render(<AlertDescription>desc</AlertDescription>);
      expect(container.firstChild).toHaveClass("text-sm");
    });
  });

  describe("Alert — composition", () => {
    it("renders full alert structure", () => {
      const { getByText, getByRole } = render(
        <Alert>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>Something needs attention.</AlertDescription>
        </Alert>
      );
      expect(getByRole("alert")).toBeTruthy();
      expect(getByText("Heads up")).toBeTruthy();
      expect(getByText("Something needs attention.")).toBeTruthy();
    });
  });