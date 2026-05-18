import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb } from "./Breadcrumb";

  const defaultItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Laptops" },
  ];

  describe("Breadcrumb — rendering", () => {
    it("renders a nav with aria-label=breadcrumb", () => {
      const { getByRole } = render(<Breadcrumb items={defaultItems} />);
      expect(getByRole("navigation", { name: "breadcrumb" })).toBeTruthy();
    });

    it("renders all item labels", () => {
      const { getByText } = render(<Breadcrumb items={defaultItems} />);
      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Products")).toBeTruthy();
      expect(getByText("Laptops")).toBeTruthy();
    });

    it("merges consumer className", () => {
      const { container } = render(
        <Breadcrumb items={defaultItems} className="mt-4" />
      );
      const ol = container.querySelector("ol");
      expect(ol).toHaveClass("mt-4");
    });
  });

  describe("Breadcrumb — links vs page", () => {
    it("renders non-last items with href as links", () => {
      const { getByText } = render(<Breadcrumb items={defaultItems} />);
      expect(getByText("Home").nodeName).toBe("A");
      expect(getByText("Products").nodeName).toBe("A");
    });

    it("renders last item as BreadcrumbPage not a link", () => {
      const { getByText } = render(<Breadcrumb items={defaultItems} />);
      expect(getByText("Laptops").nodeName).toBe("SPAN");
    });

    it("last item has aria-current=page", () => {
      const { getByText } = render(<Breadcrumb items={defaultItems} />);
      expect(getByText("Laptops")).toHaveAttribute("aria-current", "page");
    });

    it("renders item without href as page even if not last", () => {
      const { getByText } = render(
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "No Link" },
            { label: "Current" },
          ]}
        />
      );
      expect(getByText("No Link").nodeName).toBe("SPAN");
    });
  });

  describe("Breadcrumb — separators", () => {
    it("renders default separator between items", () => {
      const { getAllByText } = render(<Breadcrumb items={defaultItems} />);
      expect(getAllByText("/")).toHaveLength(2);
    });

    it("renders custom separator", () => {
      const { getAllByText } = render(
        <Breadcrumb items={defaultItems} separator="›" />
      );
      expect(getAllByText("›")).toHaveLength(2);
    });

    it("does not render separator after last item", () => {
      const { getAllByText } = render(
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Current" }]} />
      );
      expect(getAllByText("/")).toHaveLength(1);
    });
  });

  describe("Breadcrumb — single item", () => {
    it("renders without separators for single item", () => {
      const { queryByText } = render(
        <Breadcrumb items={[{ label: "Home" }]} />
      );
      expect(queryByText("/")).toBeNull();
    });
  });

  describe("Breadcrumb — collapsing", () => {
    const manyItems = [
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "Components", href: "/docs/components" },
      { label: "Breadcrumb", href: "/docs/components/breadcrumb" },
      { label: "Examples" },
    ];

    it("collapses middle items when items exceed maxItems", () => {
      const { getByText, queryByText } = render(
        <Breadcrumb items={manyItems} maxItems={3} />
      );
      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Examples")).toBeTruthy();
      expect(queryByText("Docs")).toBeNull();
      expect(queryByText("Components")).toBeNull();
    });

    it("renders ellipsis button when collapsed", () => {
      render(<Breadcrumb items={manyItems} maxItems={3} />);
      expect(screen.getByRole("button", { name: /show more/i })).toBeTruthy();
    });

    it("expands all items when ellipsis is clicked", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb items={manyItems} maxItems={3} />);
      await user.click(screen.getByRole("button", { name: /show more/i }));
      expect(screen.getByText("Docs")).toBeTruthy();
      expect(screen.getByText("Components")).toBeTruthy();
      expect(screen.getByText("Breadcrumb")).toBeTruthy();
    });

    it("does not collapse when items count is within maxItems", () => {
      render(<Breadcrumb items={manyItems} maxItems={10} />);
      expect(screen.queryByRole("button", { name: /show more/i })).toBeNull();
    });

    it("does not collapse when maxItems is not set", () => {
      render(<Breadcrumb items={manyItems} />);
      expect(screen.queryByRole("button", { name: /show more/i })).toBeNull();
    });
  });