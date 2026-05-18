import { render } from "@testing-library/react";
  import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
  } from "./table";

  const BasicTable = () => (
    <Table>
      <TableCaption>A list of items</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Item 1</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Item 2</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>2</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );

  describe("Table — rendering", () => {
    it("renders a table element", () => {
      const { container } = render(<BasicTable />);
      expect(container.querySelector("table")).toBeTruthy();
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(
        <Table ref={ref}>
          <TableBody>
            <TableRow><TableCell>x</TableCell></TableRow>
          </TableBody>
        </Table>
      );
      expect(ref.current).not.toBeNull();
    });

    it("wraps table in overflow container", () => {
      const { container } = render(<BasicTable />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("overflow-auto");
    });
  });

  describe("Table — semantic elements", () => {
    it("renders thead", () => {
      const { container } = render(<BasicTable />);
      expect(container.querySelector("thead")).toBeTruthy();
    });

    it("renders tbody", () => {
      const { container } = render(<BasicTable />);
      expect(container.querySelector("tbody")).toBeTruthy();
    });

    it("renders tfoot", () => {
      const { container } = render(<BasicTable />);
      expect(container.querySelector("tfoot")).toBeTruthy();
    });

    it("renders th elements in header", () => {
      const { container } = render(<BasicTable />);
      const headers = container.querySelectorAll("th");
      expect(headers.length).toBe(2);
    });

    it("renders td elements in body", () => {
      const { container } = render(<BasicTable />);
      const cells = container.querySelectorAll("tbody td");
      expect(cells.length).toBe(4);
    });

    it("renders caption", () => {
      const { container } = render(<BasicTable />);
      expect(container.querySelector("caption")).toBeTruthy();
    });
  });

  describe("Table — content", () => {
    it("renders header text", () => {
      const { getByText } = render(<BasicTable />);
      expect(getByText("Name")).toBeTruthy();
      expect(getByText("Status")).toBeTruthy();
    });

    it("renders cell content", () => {
      const { getByText } = render(<BasicTable />);
      expect(getByText("Item 1")).toBeTruthy();
      expect(getByText("Item 2")).toBeTruthy();
    });

    it("renders caption text", () => {
      const { getByText } = render(<BasicTable />);
      expect(getByText("A list of items")).toBeTruthy();
    });
  });

  describe("TableRow", () => {
    it("applies hover class", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow><TableCell>x</TableCell></TableRow>
          </TableBody>
        </Table>
      );
      const row = container.querySelector("tr");
      expect(row).toHaveClass("hover:bg-muted/50");
    });
  });