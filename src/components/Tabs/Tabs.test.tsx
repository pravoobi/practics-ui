import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

  const defaultItems = [
    { value: "tab1", label: "Tab 1", content: <p>Content 1</p> },
    { value: "tab2", label: "Tab 2", content: <p>Content 2</p> },
    { value: "tab3", label: "Tab 3", content: <p>Content 3</p> },
  ];

  describe("Tabs — rendering", () => {
    it("renders all tab triggers", () => {
      render(<Tabs items={defaultItems} />);
      expect(screen.getByText("Tab 1")).toBeTruthy();
      expect(screen.getByText("Tab 2")).toBeTruthy();
      expect(screen.getByText("Tab 3")).toBeTruthy();
    });

    it("renders first tab content by default", () => {
      render(<Tabs items={defaultItems} />);
      expect(screen.getByText("Content 1")).toBeTruthy();
      expect(screen.queryByText("Content 2")).toBeNull();
    });

    it("renders specified defaultValue tab", () => {
      render(<Tabs items={defaultItems} defaultValue="tab2" />);
      expect(screen.getByText("Content 2")).toBeTruthy();
      expect(screen.queryByText("Content 1")).toBeNull();
    });
  });

  describe("Tabs — interaction", () => {
    it("switches content on tab click", async () => {
      const user = userEvent.setup();
      render(<Tabs items={defaultItems} />);
      await user.click(screen.getByText("Tab 2"));
      expect(screen.getByText("Content 2")).toBeTruthy();
      expect(screen.queryByText("Content 1")).toBeNull();
    });

    it("calls onValueChange when tab is clicked", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Tabs items={defaultItems} onValueChange={onValueChange} />);
      await user.click(screen.getByText("Tab 2"));
      expect(onValueChange).toHaveBeenCalledWith("tab2");
    });
  });

  describe("Tabs — disabled", () => {
    it("does not switch to disabled tab", async () => {
      const user = userEvent.setup();
      render(
        <Tabs
          items={[
            { value: "tab1", label: "Tab 1", content: <p>Content 1</p> },
            { value: "tab2", label: "Tab 2", content: <p>Content 2</p>, disabled: true },
          ]}
        />
      );
      await user.click(screen.getByText("Tab 2"));
      expect(screen.queryByText("Content 2")).toBeNull();
      expect(screen.getByText("Content 1")).toBeTruthy();
    });
  });

  describe("Tabs — manual composition", () => {
    it("renders with children instead of items", () => {
      render(
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
          <TabsContent value="b">Content B</TabsContent>
        </Tabs>
      );
      expect(screen.getByText("A")).toBeTruthy();
      expect(screen.getByText("Content A")).toBeTruthy();
      expect(screen.queryByText("Content B")).toBeNull();
    });
  });

 describe("TabsList — mobile scroll", () => {
    it("applies overflow-x-auto class", () => {
      render(
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content</TabsContent>
        </Tabs>
      );
      const list = screen.getByRole("tablist");
      expect(list).toHaveClass("overflow-x-auto");
      expect(list).toHaveClass("w-full");
    });

    it("applies shrink-0 to triggers", () => {
      render(
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content</TabsContent>
        </Tabs>
      );
      const trigger = screen.getByRole("tab", { name: "A" });
      expect(trigger).toHaveClass("shrink-0");
    });
  });