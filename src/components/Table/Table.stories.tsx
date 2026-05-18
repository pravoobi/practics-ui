import type { Meta, StoryObj } from "@storybook/react";
  import type { ColumnDef } from "./Table.types";
  import { Table, DataTable } from "./Table";

  const meta: Meta = {
    title: "Components/Table",
    tags: ["autodocs"],
  };

  export default meta;

  type Person = { name: string; role: string; status: string; joined: string };

  const people: Person[] = [
    { name: "Alice Johnson", role: "Engineer", status: "Active", joined: "2021-03-15" },
    { name: "Bob Smith", role: "Designer", status: "Active", joined: "2022-07-01" },
    { name: "Carol White", role: "Manager", status: "On Leave", joined: "2020-01-10" },
    { name: "David Brown", role: "Engineer", status: "Inactive", joined: "2019-11-22" },
  ];

  const personColumns: ColumnDef<Person>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "joined", header: "Joined" },
  ];

  export const Default: StoryObj = {
    render: () => <Table columns={personColumns} data={people} />,
  };

  export const WithCaption: StoryObj = {
    render: () => <Table columns={personColumns} data={people} caption="Team members" />,
  };

  export const EmptyState: StoryObj = {
    render: () => <Table columns={personColumns} data={[]} />,
  };

  export const Sortable: StoryObj = {
    render: () => (
      <DataTable
        columns={personColumns}
        data={people}
        caption="Click column headers to sort"
      />
    ),
  };

  export const SortableWithDefaultSort: StoryObj = {
    render: () => (
      <DataTable
        columns={personColumns}
        data={people}
        defaultSorting={[{ id: "name", desc: false }]}
      />
    ),
  };

  export const ResponsiveColumns: StoryObj = {
    render: () => (
      <Table
        caption="Resize the window — Role and Joined columns hide below sm breakpoint"
        columns={[
          { accessorKey: "name", header: "Name" },
          { accessorKey: "role", header: "Role", meta: { hideBelow: "sm" } },
          { accessorKey: "status", header: "Status" },
          { accessorKey: "joined", header: "Joined", meta: { hideBelow: "sm" } },
        ]}
        data={people}
      />
    ),
  };