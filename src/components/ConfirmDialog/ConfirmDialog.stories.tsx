import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "@/components/Button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

const Controlled = (props: Omit<React.ComponentProps<typeof ConfirmDialog>, "open" | "onOpenChange" | "onConfirm">) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <ConfirmDialog
        {...props}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          alert("Confirmed!");
          setOpen(false);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: () => (
    <Controlled
      title="Are you sure?"
      description="This will permanently remove the item. This action cannot be undone."
    />
  ),
};

export const Destructive: Story = {
  render: () => (
    <Controlled
      title="Delete project"
      description="Deleting this project will remove all associated data, including tasks, files, and history. This cannot be reversed."
      confirmLabel="Delete project"
      variant="destructive"
    />
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <Controlled
      title="Publish changes"
      description="Your changes will be visible to all users immediately."
      confirmLabel="Yes, publish"
      cancelLabel="Not yet"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <ConfirmDialog
      open
      onOpenChange={() => {}}
      title="Deleting…"
      description="Please wait while the item is being deleted."
      onConfirm={() => {}}
      loading
    />
  ),
};
