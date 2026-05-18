import type { Meta, StoryObj } from "@storybook/react";
  import { Alert, AlertTitle, AlertDescription } from "./Alert";

  const meta: Meta<typeof Alert> = {
    title: "Components/Alert",
    component: Alert,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Alert>;

  export const Default: Story = {
    render: () => (
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can change this in your settings.</AlertDescription>
      </Alert>
    ),
  };

  export const Info: Story = {
    render: () => (
      <Alert variant="info">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Your session will expire in 30 minutes.</AlertDescription>
      </Alert>
    ),
  };

  export const Success: Story = {
    render: () => (
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Alert>
    ),
  };

  export const Warning: Story = {
    render: () => (
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This action may affect other users.</AlertDescription>
      </Alert>
    ),
  };

  export const Destructive: Story = {
    render: () => (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong. Please try again.</AlertDescription>
      </Alert>
    ),
  };

  export const AllVariants: Story = {
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {(["default", "info", "success", "warning", "destructive"] as const).map(
          (variant) => (
            <Alert key={variant} variant={variant}>
              <AlertTitle>{variant}</AlertTitle>
              <AlertDescription>Alert description for variant "{variant}".</AlertDescription>
            </Alert>
          )
        )}
      </div>
    ),
  };