import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
  import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarNav,
    NavItem,
    NavGroup,
  } from "./Sidebar";

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

    it("merges consumer className", () => {
      const { container } = render(<Sidebar className="w-48" />);
      expect(container.firstChild).toHaveClass("w-48");
    });
  });

  describe("NavItem — rendering", () => {
    it("renders an anchor", () => {
      const { container } = render(
        <NavItem href="/home">Home</NavItem>
      );
      expect(container.firstChild?.nodeName).toBe("A");
    });

    it("renders label", () => {
      const { getByText } = render(
        <NavItem href="/home">Dashboard</NavItem>
      );
      expect(getByText("Dashboard")).toBeTruthy();
    });

    it("renders icon when provided", () => {
      const { getByTestId } = render(
        <NavItem href="/home" icon={<span data-testid="icon">i</span>}>
          Home
        </NavItem>
      );
      expect(getByTestId("icon")).toBeTruthy();
    });

    it("does not render icon slot when icon is omitted", () => {
      const { queryByTestId } = render(
        <NavItem href="/home">Home</NavItem>
      );
      expect(queryByTestId("icon")).toBeNull();
    });
  });

  describe("NavItem — active state", () => {
    it("applies active classes when isActive is true", () => {
      const { container } = render(
        <NavItem href="/home" isActive>Home</NavItem>
      );
      expect(container.firstChild).toHaveClass("bg-accent");
    });

    it("applies inactive classes by default", () => {
      const { container } = render(
        <NavItem href="/home">Home</NavItem>
      );
      expect(container.firstChild).toHaveClass("text-muted-foreground");
      expect(container.firstChild).not.toHaveClass("bg-accent");
    });
  });

  describe("NavItem — disabled", () => {
    it("applies disabled classes when disabled is true", () => {
      const { container } = render(
        <NavItem href="/home" disabled>Home</NavItem>
      );
      expect(container.firstChild).toHaveClass("pointer-events-none");
      expect(container.firstChild).toHaveClass("opacity-50");
    });
  });

  describe("NavItem — badge", () => {
    it("renders badge when provided", () => {
      const { getByText } = render(
        <NavItem href="/inbox" badge={5}>Inbox</NavItem>
      );
      expect(getByText("5")).toBeTruthy();
    });

    it("renders badge when value is 0", () => {
      const { getByText } = render(
        <NavItem href="/inbox" badge={0}>Inbox</NavItem>
      );
      expect(getByText("0")).toBeTruthy();
    });

    it("does not render badge when omitted", () => {
      const { queryByText } = render(
        <NavItem href="/inbox">Inbox</NavItem>
      );
      expect(queryByText("0")).toBeNull();
    });
  });

  describe("NavGroup — rendering", () => {
    it("renders group label when provided", () => {
      const { getByText } = render(
        <NavGroup
          group={{
            label: "Main",
            items: [{ label: "Home", href: "/home" }],
          }}
        />
      );
      expect(getByText("Main")).toBeTruthy();
    });

    it("renders all items", () => {
      const { getByText } = render(
        <NavGroup
          group={{
            items: [
              { label: "Home", href: "/home" },
              { label: "Settings", href: "/settings" },
            ],
          }}
        />
      );
      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Settings")).toBeTruthy();
    });

    it("does not render label when omitted", () => {
      const { queryByText } = render(
        <NavGroup
          group={{
            items: [{ label: "Home", href: "/home" }],
          }}
        />
      );
      expect(queryByText("Main")).toBeNull();
    });
  });

  describe("Sidebar — composition", () => {
    it("renders full sidebar structure", () => {
      const { getByText } = render(
        <Sidebar>
          <SidebarHeader>Logo</SidebarHeader>
          <SidebarContent>
            <SidebarNav>
              <NavItem href="/home" isActive>Home</NavItem>
              <NavItem href="/settings">Settings</NavItem>
            </SidebarNav>
          </SidebarContent>
          <SidebarFooter>Footer</SidebarFooter>
        </Sidebar>
      );
      expect(getByText("Logo")).toBeTruthy();
      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Settings")).toBeTruthy();
      expect(getByText("Footer")).toBeTruthy();
    });
  });

   describe("Sidebar — mobile drawer", () => {
    it("renders overlay when in drawer mode", () => {
      const { container } = render(
        <Sidebar isOpen onClose={() => {}}>Content</Sidebar>
      );
      expect(container.childElementCount).toBe(2);
    });

    it("does not render overlay without onClose", () => {
      const { container } = render(<Sidebar>Content</Sidebar>);
      expect(container.childElementCount).toBe(1);
    });

    it("calls onClose when overlay is clicked", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const { container } = render(
        <Sidebar isOpen onClose={onClose}>Content</Sidebar>
      );
      await user.click(container.children[0] as HTMLElement);
      expect(onClose).toHaveBeenCalled();
    });

    it("applies translate-x-0 when open", () => {
      const { container } = render(
        <Sidebar isOpen onClose={() => {}}>Content</Sidebar>
      );
      expect(container.children[1]).toHaveClass("translate-x-0");
    });

    it("applies -translate-x-full when closed", () => {
      const { container } = render(
        <Sidebar isOpen={false} onClose={() => {}}>Content</Sidebar>
      );
      expect(container.children[1]).toHaveClass("-translate-x-full");
    });
  });