 import type { Meta, StoryObj } from "@storybook/react";
  import { Grid } from "./Grid";

  const meta: Meta<typeof Grid> = {
    title: "Layout/Grid",
    component: Grid,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Grid>;

  const Item = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "14px",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );

  const items = Array.from({ length: 6 }, (_, i) => (
    <Item key={i}>Item {i + 1}</Item>
  ));

  export const TwoColumns: Story = {
    render: () => <Grid cols={2} gap={4}>{items}</Grid>,
  };

  export const ThreeColumns: Story = {
    render: () => <Grid cols={3} gap={4}>{items}</Grid>,
  };

  export const FourColumns: Story = {
    render: () => <Grid cols={4} gap={4}>{items}</Grid>,
  };

  export const WithGapXY: Story = {
    render: () => (
      <Grid cols={3} gapX={8} gapY={2}>
        {items}
      </Grid>
    ),
  };

  export const WithRows: Story = {
    render: () => (
      <Grid cols={3} rows={2} gap={4}>
        {items}
      </Grid>
    ),
  };

  export const WithPadding: Story = {
    render: () => (
      <Grid
        cols={3}
        gap={4}
        padding={6}
        style={{ background: "hsl(var(--muted))" }}
      >
        {items}
      </Grid>
    ),
  };

  export const AsSection: Story = {
    render: () => (
      <Grid as="section" cols={2} gap={4}>
        {items}
      </Grid>
    ),
  };