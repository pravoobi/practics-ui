 import type { Meta, StoryObj } from "@storybook/react";
  import { Badge } from "./Badge";

  const meta: Meta<typeof Badge> = {
    title: "Components/Badge",
    component: Badge,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Badge>;

  export const Default: Story = {
    render: () => <Badge>Default</Badge>,
  };

  export const Secondary: Story = {
    render: () => <Badge variant="secondary">Secondary</Badge>,
  };

  export const Destructive: Story = {
    render: () => <Badge variant="destructive">Destructive</Badge>,
  };

  export const Outline: Story = {
    render: () => <Badge variant="outline">Outline</Badge>,
  };

  export const Success: Story = {
    render: () => <Badge variant="success">Success</Badge>,
  };

  export const Warning: Story = {
    render: () => <Badge variant="warning">Warning</Badge>,
  };

  export const AllVariants: Story = {
    render: () => (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {(["default", "secondary", "destructive", "outline", "success", "warning"] as const).map(
          (variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          )
        )}
      </div>
    ),
  };

  export const WithCustomClass: Story = {
    render: () => (
      <Badge className="uppercase tracking-widest">custom</Badge>
    ),
  };