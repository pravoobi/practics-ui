import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

  const DefaultTabs = () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  );

  describe("Tabs — rendering", () => {
    it("renders tab triggers", () => {
      render(<DefaultTabs />);
      expect(screen.getByText("Tab 1")).toBeTruthy();
      expect(screen.getByText("Tab 2")).toBeTruthy();
    });

    it("renders active content by default", () => {
      render(<DefaultTabs />);
      expect(screen.getByText("Content 1")).toBeTruthy();
    });

    it("does not render inactive content", () => {
      render(<DefaultTabs />);
      expect(screen.queryByText("Content 2")).toBeNull();
    });
  });

  describe("Tabs — interaction", () => {
    it("shows content of clicked tab", async () => {
      const user = userEvent.setup();
      render(<DefaultTabs />);
      await user.click(screen.getByText("Tab 2"));
      expect(screen.getByText("Content 2")).toBeTruthy();
      expect(screen.queryByText("Content 1")).toBeNull();
    });
  });

  describe("TabsList", () => {
    it("applies base classes", () => {
      render(<DefaultTabs />);
      const list = screen.getByRole("tablist");
      expect(list).toHaveClass("bg-muted");
      expect(list).toHaveClass("rounded-md");
    });
  });

  describe("TabsTrigger", () => {
    it("renders with tab role", () => {
      render(<DefaultTabs />);
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);
    });

    it("marks default tab as active", () => {
      render(<DefaultTabs />);
      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      expect(tab1).toHaveAttribute("data-state", "active");
    });

    it("marks non-active tab as inactive", () => {
      render(<DefaultTabs />);
      const tab2 = screen.getByRole("tab", { name: "Tab 2" });
      expect(tab2).toHaveAttribute("data-state", "inactive");
    });
  });

  describe("TabsContent", () => {
    it("renders with tabpanel role", () => {
      render(<DefaultTabs />);
      expect(screen.getByRole("tabpanel")).toBeTruthy();
    });

    it("merges consumer className", () => {
      render(
        <Tabs defaultValue="t1">
          <TabsList>
            <TabsTrigger value="t1">T1</TabsTrigger>
          </TabsList>
          <TabsContent value="t1" className="p-4">
            content
          </TabsContent>
        </Tabs>
      );
      expect(screen.getByRole("tabpanel")).toHaveClass("p-4");
    });
  });