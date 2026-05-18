 import { render } from "@testing-library/react";
  import { Avatar } from "./Avatar";

  describe("Avatar — rendering", () => {
    it("renders a span as root", () => {
      const { container } = render(<Avatar fallback="JD" alt="John Doe" />);
      expect(container.firstChild?.nodeName).toBe("SPAN");
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Avatar ref={ref} fallback="JD" alt="John Doe" />);
      expect(ref.current).not.toBeNull();
    });

    it("merges consumer className", () => {
      const { container } = render(
        <Avatar fallback="JD" alt="John Doe" className="ring-2" />
      );
      expect(container.firstChild).toHaveClass("ring-2");
      expect(container.firstChild).toHaveClass("rounded-full");
    });
  });

  describe("Avatar — sizes", () => {
    it.each([
      ["xs", "h-6"],
      ["sm", "h-8"],
      ["md", "h-10"],
      ["lg", "h-12"],
      ["xl", "h-16"],
    ] as const)("applies size=%s", (size, expectedClass) => {
      const { container } = render(
        <Avatar size={size} fallback="JD" alt="John Doe" />
      );
      expect(container.firstChild).toHaveClass(expectedClass);
    });

    it("applies md size by default", () => {
      const { container } = render(<Avatar fallback="JD" alt="John Doe" />);
      expect(container.firstChild).toHaveClass("h-10");
      expect(container.firstChild).toHaveClass("w-10");
    });
  });

  describe("Avatar — fallback", () => {
    it("renders fallback text", () => {
      const { getByText } = render(<Avatar fallback="JD" alt="John Doe" />);
      expect(getByText("JD")).toBeTruthy();
    });

    it("renders fallback when no src provided", () => {
      const { getByText } = render(<Avatar fallback="AB" alt="Test" />);
      expect(getByText("AB")).toBeTruthy();
    });
  });

  describe("Avatar — image", () => {
    it("renders without error when src is provided", () => {
      expect(() =>
        render(
          <Avatar
            src="https://example.com/avatar.jpg"
            alt="User"
            fallback="JD"
          />
        )
      ).not.toThrow();
    });

    it("renders without error when src is omitted", () => {
      expect(() =>
        render(<Avatar fallback="JD" alt="John Doe" />)
      ).not.toThrow();
    });
  });