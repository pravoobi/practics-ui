import type { Meta, StoryObj } from "@storybook/react";
  import { Textarea } from "./Textarea";

  const meta: Meta<typeof Textarea> = {
    title: "Components/Textarea",
    component: Textarea,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Textarea>;

  export const Default: Story = {
    args: { label: "Message", placeholder: "Enter your message" },
  };

  export const WithHelperText: Story = {
    args: {
      label: "Message",
      placeholder: "Enter your message",
      helperText: "Maximum 500 characters.",
    },
  };

  export const WithError: Story = {
    args: {
      label: "Message",
      placeholder: "Enter your message",
      error: "Message is required.",
    },
  };

  export const WithRows: Story = {
    args: {
      label: "Message",
      placeholder: "Enter your message",
      rows: 6,
    },
  };

  export const Disabled: Story = {
    args: {
      label: "Message",
      placeholder: "Enter your message",
      disabled: true,
    },
  };

  export const NoLabel: Story = {
    args: {
      placeholder: "Write something...",
      "aria-label": "Message",
    },
  };