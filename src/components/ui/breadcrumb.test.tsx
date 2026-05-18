import { render } from "@testing-library/react";
  import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "./breadcrumb";

  describe("Breadcrumb — rendering", () => {
    it("renders a nav with aria-label=breadcrumb", () => {
      const { getByRole } = render(<Breadcrumb />);
      const nav = getByRole("navigation", { name: "breadcrumb" });
      expect(nav).toBeTruthy();
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Breadcrumb ref={ref} />);
      expect(ref.current).not.toBeNull();
    });
  });

  describe("BreadcrumbList", () => {
    it("renders an ol", () => {
      const { container } = render(<BreadcrumbList />);
      expect(container.firstChild?.nodeName).toBe("OL");
    });

    it("applies flex layout", () => {
      const { container } = render(<BreadcrumbList />);
      expect(container.firstChild).toHaveClass("flex");
      expect(container.firstChild).toHaveClass("items-center");
    });
  });

  describe("BreadcrumbItem", () => {
    it("renders an li", () => {
      const { container } = render(<BreadcrumbItem />);
      expect(container.firstChild?.nodeName).toBe("LI");
    });
  });

  describe("BreadcrumbLink", () => {
    it("renders an anchor by default", () => {
      const { container } = render(
        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
      );
      expect(container.firstChild?.nodeName).toBe("A");
    });

    it("applies hover class", () => {
      const { container } = render(
        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
      );
      expect(container.firstChild).toHaveClass("hover:text-foreground");
    });
  });

  describe("BreadcrumbPage", () => {
    it("renders a span with aria-current=page", () => {
      const { container } = render(<BreadcrumbPage>Current</BreadcrumbPage>);
      expect(container.firstChild?.nodeName).toBe("SPAN");
      expect(container.firstChild).toHaveAttribute("aria-current", "page");
    });

    it("applies foreground text class", () => {
      const { container } = render(<BreadcrumbPage>Current</BreadcrumbPage>);
      expect(container.firstChild).toHaveClass("text-foreground");
    });
  });

  describe("BreadcrumbSeparator", () => {
    it("renders default separator", () => {
      const { getByText } = render(<BreadcrumbSeparator />);
      expect(getByText("/")).toBeTruthy();
    });

    it("renders custom separator", () => {
      const { getByText } = render(
        <BreadcrumbSeparator>›</BreadcrumbSeparator>
      );
      expect(getByText("›")).toBeTruthy();
    });

    it("has aria-hidden=true", () => {
      const { container } = render(<BreadcrumbSeparator />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Breadcrumb — composition", () => {
    it("renders full breadcrumb structure", () => {
      const { getByRole, getByText } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      expect(getByRole("navigation", { name: "breadcrumb" })).toBeTruthy();
      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Products")).toBeTruthy();
    });
  });