import type { Meta, StoryObj } from "@storybook/react";
  import { Stack } from "./Stack";

  const meta: Meta<typeof Stack> = {
    title: "Layout/Stack",
    component: Stack,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Stack>;

  const Item = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "14px",
      }}
    >
      {children}
    </div>
  );

  export const Row: Story = {
    args: { direction: "row", gap: 2 },
    render: (args) => (
      <Stack {...args}>
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Stack>
    ),
  };

  export const Column: Story = {
    args: { direction: "column", gap: 2 },
    render: (args) => (
      <Stack {...args}>
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Stack>
    ),
  };

  export const Centered: Story = {
    args: { direction: "row", gap: 2, align: "center", justify: "center" },
    render: (args) => (
      <Stack {...args} style={{ minHeight: "120px", border: "1px dashed hsl(var(--border))" }}>
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Stack>
    ),
  };

  export const SpaceBetween: Story = {
    args: { direction: "row", align: "center", justify: "between" },
    render: (args) => (
      <Stack {...args} style={{ border: "1px dashed hsl(var(--border))" }}>
        <Item>Left</Item>
        <Item>Right</Item>
      </Stack>
    ),
  };

  export const Wrapping: Story = {
    args: { direction: "row", gap: 2, wrap: true },
    render: (args) => (
      <Stack {...args} style={{ width: "200px", border: "1px dashed hsl(var(--border))" }}>
        {Array.from({ length: 6 }, (_, i) => (
          <Item key={i}>Item {i + 1}</Item>
        ))}
      </Stack>
    ),
  };

  export const AsNav: Story = {
    args: { as: "nav", direction: "row", gap: 4, align: "center" },
    render: (args) => (
      <Stack {...args}>
        <Item>Home</Item>
        <Item>About</Item>
        <Item>Contact</Item>
      </Stack>
    ),
  };