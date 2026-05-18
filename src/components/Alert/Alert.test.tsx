 import { render } from "@testing-library/react";
  import { Alert, AlertTitle, AlertDescription } from "./Alert";

  describe("Alert — rendering", () => {
    it("renders with role=alert", () => {
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

  describe("Alert — UI layer variants", () => {
    it("applies default variant by default", () => {
      const { getByRole } = render(<Alert>content</Alert>);
      expect(getByRole("alert")).toHaveClass("bg-background");
    });

    it("applies destructive variant", () => {
      const { getByRole } = render(
        <Alert variant="destructive">content</Alert>
      );
      expect(getByRole("alert")).toHaveClass("text-destructive");
    });
  });

  describe("Alert — product layer variants", () => {
    it.each([
      ["info", "text-blue-700"],
      ["success", "text-green-700"],
      ["warning", "text-yellow-700"],
    ] as const)("applies variant=%s", (variant, expectedClass) => {
      const { getByRole } = render(
        <Alert variant={variant}>content</Alert>
      );
      expect(getByRole("alert")).toHaveClass(expectedClass);
    });

    it("merges consumer className on info variant", () => {
      const { getByRole } = render(
        <Alert variant="info" className="mt-4">content</Alert>
      );
      expect(getByRole("alert")).toHaveClass("text-blue-700");
      expect(getByRole("alert")).toHaveClass("mt-4");
    });
  });

  describe("Alert — composition", () => {
    it("renders full alert structure", () => {
      const { getByRole, getByText } = render(
        <Alert variant="success">
          <AlertTitle>Done</AlertTitle>
          <AlertDescription>All changes saved.</AlertDescription>
        </Alert>
      );
      expect(getByRole("alert")).toBeTruthy();
      expect(getByText("Done")).toBeTruthy();
      expect(getByText("All changes saved.")).toBeTruthy();
    });
  });