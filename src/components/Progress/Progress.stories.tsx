import type { Meta, StoryObj } from "@storybook/react";
  import { Progress } from "./Progress";

  const meta: Meta<typeof Progress> = {
    title: "Components/Progress",
    component: Progress,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Progress>;

  export const Default: Story = {
    render: () => <Progress value={60} />,
  };

  export const Sizes: Story = {
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Progress size="sm" value={40} label="Small" />
        <Progress size="md" value={60} label="Medium" />
        <Progress size="lg" value={80} label="Large" />
      </div>
    ),
  };

  export const Variants: Story = {
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Progress variant="default" value={60} label="Default" />
        <Progress variant="success" value={100} label="Success" />
        <Progress variant="warning" value={50} label="Warning" />
        <Progress variant="destructive" value={30} label="Destructive" />
      </div>
    ),
  };

  export const WithValue: Story = {
    render: () => <Progress value={72} showValue />,
  };

  export const WithLabelAndValue: Story = {
    render: () => <Progress value={45} label="Uploading..." showValue />,
  };

  export const EdgeCases: Story = {
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Progress value={0} label="0%" showValue />
        <Progress value={100} label="Complete" showValue />
        <Progress value={150} label="Over 100 (clamped)" showValue />
      </div>
    ),
  };