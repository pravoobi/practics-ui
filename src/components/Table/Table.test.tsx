import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import type { ColumnDef } from "./Table.types";
  import { Table, DataTable } from "./Table";

  type Person = { name: string; role: string; age: number };

  const columns: ColumnDef<Person>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "age", header: "Age" },
  ];

  const data: Person[] = [
    { name: "Alice", role: "Engineer", age: 30 },
    { name: "Bob", role: "Designer", age: 25 },
    { name: "Carol", role: "Manager", age: 35 },
  ];

  describe("Table — rendering", () => {
    it("renders column headers", () => {
      render(<Table columns={columns} data={data} />);
      expect(screen.getByText("Name")).toBeTruthy();
      expect(screen.getByText("Role")).toBeTruthy();
      expect(screen.getByText("Age")).toBeTruthy();
    });

    it("renders all rows", () => {
      render(<Table columns={columns} data={data} />);
      expect(screen.getByText("Alice")).toBeTruthy();
      expect(screen.getByText("Bob")).toBeTruthy();
      expect(screen.getByText("Carol")).toBeTruthy();
    });

    it("renders caption when provided", () => {
      render(<Table columns={columns} data={data} caption="Team list" />);
      expect(screen.getByText("Team list")).toBeTruthy();
    });

    it("renders empty state when data is empty", () => {
      render(<Table columns={columns} data={[]} />);
      expect(screen.getByText("No results.")).toBeTruthy();
    });
  });

  describe("DataTable — sorting", () => {
    it("renders column headers", () => {
      render(<DataTable columns={columns} data={data} />);
      expect(screen.getByText("Name")).toBeTruthy();
      expect(screen.getByText("Role")).toBeTruthy();
    });

    it("renders all rows", () => {
      render(<DataTable columns={columns} data={data} />);
      expect(screen.getByText("Alice")).toBeTruthy();
      expect(screen.getByText("Bob")).toBeTruthy();
      expect(screen.getByText("Carol")).toBeTruthy();
    });

    it("sorts ascending on header click", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} />);
    await user.click(screen.getByRole("columnheader", { name: /Name/i }));
    const cells = screen.getAllByRole("cell");
    const names = cells.map((c) => c.textContent).filter((t) =>
      ["Alice", "Bob", "Carol"].includes(t ?? "")
    );
    expect(names).toEqual(["Alice", "Bob", "Carol"]);
  });

  it("sorts descending on second header click", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} />);
    await user.click(screen.getByRole("columnheader", { name: /Name/i }));
    await user.click(screen.getByRole("columnheader", { name: /Name/i }));
    const cells = screen.getAllByRole("cell");
    const names = cells.map((c) => c.textContent).filter((t) =>
      ["Alice", "Bob", "Carol"].includes(t ?? "")
    );
    expect(names).toEqual(["Carol", "Bob", "Alice"]);
  });

  it("calls onSortingChange when header clicked", async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();
    render(<DataTable columns={columns} data={data} onSortingChange={onSortingChange} />);
    await user.click(screen.getByRole("columnheader", { name: /Name/i }));
    expect(onSortingChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
  });

    it("applies defaultSorting", () => {
      render(
        <DataTable
          columns={columns}
          data={data}
          defaultSorting={[{ id: "age", desc: false }]}
        />
      );
      const cells = screen.getAllByRole("cell");
      const ages = cells.map((c) => c.textContent).filter((t) =>
        ["25", "30", "35"].includes(t ?? "")
      );
      expect(ages).toEqual(["25", "30", "35"]);
    });

    it("renders empty state when data is empty", () => {
      render(<DataTable columns={columns} data={[]} />);
      expect(screen.getByText("No results.")).toBeTruthy();
    });
  });

  describe("Table — hideBelow", () => {
    it("applies hidden classes to column header when hideBelow is set", () => {
      render(
        <Table
          columns={[
            { accessorKey: "name", header: "Name" },
            { accessorKey: "role", header: "Role", meta: { hideBelow: "sm" } },
          ]}
          data={[{ name: "Alice", role: "Engineer" }]}
        />
      );
      const headers = screen.getAllByRole("columnheader");
      expect(headers[1]).toHaveClass("hidden");
      expect(headers[1]).toHaveClass("sm:table-cell");
    });

    it("applies hidden classes to cells when column hideBelow is set", () => {
      render(
        <Table
          columns={[
            { accessorKey: "name", header: "Name" },
            { accessorKey: "role", header: "Role", meta: { hideBelow: "md" } },
          ]}
          data={[{ name: "Alice", role: "Engineer" }]}
        />
      );
      const cells = screen.getAllByRole("cell");
      expect(cells[1]).toHaveClass("hidden");
      expect(cells[1]).toHaveClass("md:table-cell");
    });

    it("does not apply hidden classes when hideBelow is not set", () => {
      render(
        <Table
          columns={[{ accessorKey: "name", header: "Name" }]}
          data={[{ name: "Alice" }]}
        />
      );
      const header = screen.getByRole("columnheader");
      expect(header).not.toHaveClass("hidden");
    });
  });