import { render } from "@testing-library/react";
  import { Progress } from "./progress";

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
      expect(getByRole("progressbar")).toHaveClass("rounded-full");
    });
  });

  describe("Progress — ARIA attributes", () => {
    it("sets aria-valuenow", () => {
      const { getByRole } = render(<Progress value={40} />);
      expect(getByRole("progressbar").getAttribute("aria-valuenow")).toBe("40");
    });

    it("sets aria-valuemin and aria-valuemax", () => {
      const { getByRole } = render(<Progress value={40} />);
      expect(getByRole("progressbar").getAttribute("aria-valuemin")).toBe("0");
      expect(getByRole("progressbar").getAttribute("aria-valuemax")).toBe("100");
    });

    it("defaults value to 0", () => {
      const { getByRole } = render(<Progress />);
      expect(getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
    });
  });

  describe("Progress — fill width", () => {
    it("applies correct width style for value", () => {
      const { getByRole } = render(<Progress value={75} />);
      const fill = getByRole("progressbar").firstElementChild;
      expect(fill?.getAttribute("style")).toContain("width: 75%");
    });

    it("clamps value above 100 to 100%", () => {
      const { getByRole } = render(<Progress value={150} />);
      const fill = getByRole("progressbar").firstElementChild;
      expect(fill?.getAttribute("style")).toContain("width: 100%");
    });

    it("clamps value below 0 to 0%", () => {
      const { getByRole } = render(<Progress value={-10} />);
      const fill = getByRole("progressbar").firstElementChild;
      expect(fill?.getAttribute("style")).toContain("width: 0%");
    });
  });