import { render } from "@testing-library/react";
  import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

  describe("Avatar — rendering", () => {
    it("renders a span as root", () => {
      const { container } = render(<Avatar />);
      expect(container.firstChild?.nodeName).toBe("SPAN");
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Avatar ref={ref} />);
      expect(ref.current).not.toBeNull();
    });

    it("merges consumer className", () => {
      const { container } = render(<Avatar className="mt-2" />);
      expect(container.firstChild).toHaveClass("mt-2");
      expect(container.firstChild).toHaveClass("rounded-full");
    });
  });

  describe("Avatar — base classes", () => {
    it("applies size and shape classes", () => {
      const { container } = render(<Avatar />);
      expect(container.firstChild).toHaveClass("h-10");
      expect(container.firstChild).toHaveClass("w-10");
      expect(container.firstChild).toHaveClass("rounded-full");
      expect(container.firstChild).toHaveClass("overflow-hidden");
    });
  });

  describe("AvatarFallback", () => {
    it("renders fallback content", () => {
      const { getByText } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      expect(getByText("JD")).toBeTruthy();
    });

    it("applies centering classes", () => {
      const { getByText } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      const fallback = getByText("JD");
      expect(fallback).toHaveClass("flex");
      expect(fallback).toHaveClass("items-center");
      expect(fallback).toHaveClass("justify-center");
    });
  });

  describe("AvatarImage", () => {
    it("renders without error when src is provided", () => {
      expect(() =>
        render(
          <Avatar>
            <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
          </Avatar>
        )
      ).not.toThrow();
    });
  });