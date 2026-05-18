 import type { Meta, StoryObj } from "@storybook/react";
  import { Checkbox } from "./Checkbox";

  const meta: Meta<typeof Checkbox> = {
    title: "Components/Checkbox",
    component: Checkbox,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Checkbox>;

  export const Default: Story = {
    args: { label: "Accept terms and conditions" },
  };

  export const Checked: Story = {
    args: { label: "Accept terms and conditions", defaultChecked: true },
  };

  export const WithHelperText: Story = {
    args: {
      label: "Accept terms and conditions",
      helperText: "You must accept to continue.",
    },
  };

  export const WithError: Story = {
    args: {
      label: "Accept terms and conditions",
      error: "You must accept the terms.",
    },
  };

  export const Disabled: Story = {
    args: { label: "Accept terms and conditions", disabled: true },
  };

  export const DisabledChecked: Story = {
    args: {
      label: "Accept terms and conditions",
      disabled: true,
      defaultChecked: true,
    },
  };

  export const NoLabel: Story = {
    args: { "aria-label": "Accept terms" },
  };