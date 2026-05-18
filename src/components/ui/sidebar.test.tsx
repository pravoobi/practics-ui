import { render } from "@testing-library/react";
  import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarNav,
    SidebarNavItem,
    SidebarNavGroup,
    SidebarNavGroupLabel,
  } from "./sidebar";

  describe("Sidebar — rendering", () => {
    it("renders a div", () => {
      const { container } = render(<Sidebar />);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<Sidebar ref={ref} />);
      expect(ref.current).not.toBeNull();
    });

    it("applies base classes", () => {
      const { container } = render(<Sidebar />);
      expect(container.firstChild).toHaveClass("flex");
      expect(container.firstChild).toHaveClass("flex-col");
      expect(container.firstChild).toHaveClass("border-r");
    });

    it("merges consumer className", () => {
      const { container } = render(<Sidebar className="w-48" />);
      expect(container.firstChild).toHaveClass("w-48");
    });
  });

  describe("SidebarHeader", () => {
    it("renders a div with border-b", () => {
      const { container } = render(<SidebarHeader />);
      expect(container.firstChild?.nodeName).toBe("DIV");
      expect(container.firstChild).toHaveClass("border-b");
    });
  });

  describe("SidebarContent", () => {
    it("applies flex-1 and overflow-y-auto", () => {
      const { container } = render(<SidebarContent />);
      expect(container.firstChild).toHaveClass("flex-1");
      expect(container.firstChild).toHaveClass("overflow-y-auto");
    });
  });

  describe("SidebarFooter", () => {
    it("renders with border-t", () => {
      const { container } = render(<SidebarFooter />);
      expect(container.firstChild).toHaveClass("border-t");
    });
  });

  describe("SidebarNav", () => {
    it("renders a nav element", () => {
      const { container } = render(<SidebarNav />);
      expect(container.firstChild?.nodeName).toBe("NAV");
    });
  });

  describe("SidebarNavItem", () => {
    it("renders an anchor", () => {
      const { container } = render(
        <SidebarNavItem href="/home">Home</SidebarNavItem>
      );
      expect(container.firstChild?.nodeName).toBe("A");
    });

    it("applies inactive classes by default", () => {
      const { container } = render(
        <SidebarNavItem href="/home">Home</SidebarNavItem>
      );
      expect(container.firstChild).toHaveClass("text-muted-foreground");
    });

    it("applies active classes when isActive is true", () => {
      const { container } = render(
        <SidebarNavItem href="/home" isActive>Home</SidebarNavItem>
      );
      expect(container.firstChild).toHaveClass("bg-accent");
      expect(container.firstChild).toHaveClass("text-accent-foreground");
    });

    it("does not apply active classes when isActive is false", () => {
      const { container } = render(
        <SidebarNavItem href="/home" isActive={false}>Home</SidebarNavItem>
      );
      expect(container.firstChild).not.toHaveClass("bg-accent");
    });
  });

  describe("SidebarNavGroupLabel", () => {
    it("renders a p with uppercase classes", () => {
      const { container } = render(
        <SidebarNavGroupLabel>Settings</SidebarNavGroupLabel>
      );
      expect(container.firstChild?.nodeName).toBe("P");
      expect(container.firstChild).toHaveClass("uppercase");
    });
  });

  describe("Sidebar — composition", () => {
    it("renders full sidebar structure", () => {
      const { getByText, container } = render(
        <Sidebar>
          <SidebarHeader>Logo</SidebarHeader>
          <SidebarContent>
            <SidebarNav>
              <SidebarNavItem href="/home" isActive>Home</SidebarNavItem>
              <SidebarNavItem href="/settings">Settings</SidebarNavItem>
            </SidebarNav>
          </SidebarContent>
          <SidebarFooter>User</SidebarFooter>
        </Sidebar>
      );
      expect(getByText("Logo")).toBeTruthy();
      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Settings")).toBeTruthy();
      expect(getByText("User")).toBeTruthy();
    });
  });