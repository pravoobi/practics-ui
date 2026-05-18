import { render } from "@testing-library/react";
  import { Progress } from "./Progress";

  describe("Progress — rendering", () => {
    it("renders with role=progressbar", () => {
      const { getByRole } = render(<Progress value={50} />);
      expect(getByRole("progressbar")).toBeTruthy();
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Progress ref={ref} value={50} />);
      expect(ref.current).not.toBeNull();
    });

    it("merges consumer className", () => {
      const { getByRole } = render(<Progress value={50} className="mt-4" />);
      expect(getByRole("progressbar")).toHaveClass("mt-4");
    });
  });

  describe("Progress — sizes", () => {
    it.each([
      ["sm", "h-1"],
      ["md", "h-2"],
      ["lg", "h-4"],
    ] as const)("applies size=%s", (size, expectedClass) => {
      const { getByRole } = render(<Progress size={size} value={50} />);
      expect(getByRole("progressbar")).toHaveClass(expectedClass);
    });

    it("applies md size by default", () => {
      const { getByRole } = render(<Progress value={50} />);
      expect(getByRole("progressbar")).toHaveClass("h-2");
    });
  });

  describe("Progress — variants", () => {
    it("applies success variant to fill", () => {
      const { getByRole } = render(<Progress variant="success" value={50} />);
      const fill = getByRole("progressbar").firstElementChild;
      expect(fill).toHaveClass("bg-green-500");
    });

    it("applies warning variant to fill", () => {
      const { getByRole } = render(<Progress variant="warning" value={50} />);
      const fill = getByRole("progressbar").firstElementChild;
      expect(fill).toHaveClass("bg-yellow-500");
    });

    it("applies destructive variant to fill", () => {
      const { getByRole } = render(<Progress variant="destructive" value={50} />);
      const fill = getByRole("progressbar").firstElementChild;
      expect(fill).toHaveClass("bg-destructive");
    });
  });

  describe("Progress — label and showValue", () => {
    it("renders label text", () => {
      const { getByText } = render(<Progress value={50} label="Uploading" />);
      expect(getByText("Uploading")).toBeTruthy();
    });

    it("renders percentage when showValue is true", () => {
      const { getByText } = render(<Progress value={72} showValue />);
      expect(getByText("72%")).toBeTruthy();
    });

    it("renders both label and percentage together", () => {
      const { getByText } = render(
        <Progress value={45} label="Loading" showValue />
      );
      expect(getByText("Loading")).toBeTruthy();
      expect(getByText("45%")).toBeTruthy();
    });

    it("does not render label row when neither label nor showValue", () => {
      const { queryByText } = render(<Progress value={50} />);
      expect(queryByText("%")).toBeNull();
    });

    it("clamps showValue display above 100", () => {
      const { getByText } = render(<Progress value={150} showValue />);
      expect(getByText("100%")).toBeTruthy();
    });
  });