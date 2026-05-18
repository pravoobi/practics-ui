 import { render, screen, act } from "@testing-library/react";
  import { Toaster, toast } from "./Toast";

  const renderToaster = () => render(<Toaster />);

  describe("Toaster — rendering", () => {
    it("renders without crashing", () => {
      expect(() => renderToaster()).not.toThrow();
    });

    it("renders with custom position", () => {
      expect(() => render(<Toaster position="top-center" />)).not.toThrow();
    });
  });

  describe("Toaster — toast function", () => {
    it("shows toast with title", () => {
      renderToaster();
      act(() => {
        toast({ title: "Hello" });
      });
      expect(screen.getByText("Hello")).toBeTruthy();
    });

    it("shows toast with description", () => {
      renderToaster();
      act(() => {
        toast({ title: "Title", description: "Some description" });
      });
      expect(screen.getByText("Some description")).toBeTruthy();
    });

    it("shows title only toast", () => {
      renderToaster();
      act(() => {
        toast({ title: "Quick message" });
      });
      expect(screen.getByText("Quick message")).toBeTruthy();
    });
  });

  describe("Toaster — variants", () => {
    it.each([
      ["success", "bg-green-50"],
      ["warning", "bg-yellow-50"],
      ["info", "bg-blue-50"],
    ] as const)("applies %s variant class", (variant, expectedClass) => {
      renderToaster();
      act(() => {
        toast({ title: variant, variant });
      });
      const title = screen.getByText(variant);
      const toastEl = title.closest("[data-state]");
      expect(toastEl).toHaveClass(expectedClass);
    });

    it("applies destructive variant", () => {
      renderToaster();
      act(() => {
        toast({ title: "Error occurred", variant: "destructive" });
      });
      const title = screen.getByText("Error occurred");
      const toastEl = title.closest("[data-state]");
      expect(toastEl).toHaveClass("bg-destructive");
    });
  });

  describe("Toaster — toast return value", () => {
    it("returns id and dismiss function", () => {
      renderToaster();
      let result: { id: string; dismiss: () => void } | undefined;
      act(() => {
        result = toast({ title: "Dismissible" });
      });
      expect(result?.id).toBeTruthy();
      expect(typeof result?.dismiss).toBe("function");
    });

    it("dismiss hides the toast", () => {
      renderToaster();
      let result: { id: string; dismiss: () => void } | undefined;
      act(() => {
        result = toast({ title: "Will dismiss" });
      });
      expect(screen.getByText("Will dismiss")).toBeTruthy();
      act(() => {
        result?.dismiss();
      });
      expect(screen.queryByText("Will dismiss")).toBeNull();
    });
  });