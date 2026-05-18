import type { Meta, StoryObj } from "@storybook/react";
  import { Mail, Search } from "lucide-react";
  import { Input } from "./Input";

  const meta: Meta<typeof Input> = {
    title: "Components/Input",
    component: Input,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Input>;

  export const Default: Story = {
    args: { label: "Email", placeholder: "Enter your email" },
  };

  export const WithHelperText: Story = {
    args: {
      label: "Email",
      placeholder: "Enter your email",
      helperText: "We'll never share your email.",
    },
  };

  export const WithError: Story = {
    args: {
      label: "Email",
      placeholder: "Enter your email",
      error: "Email is required.",
    },
  };

  export const WithIconLeft: Story = {
    args: {
      label: "Email",
      placeholder: "Enter your email",
      iconLeft: <Mail />,
    },
  };

  export const WithIconRight: Story = {
    args: {
      label: "Search",
      placeholder: "Search...",
      iconRight: <Search />,
    },
  };

  export const Disabled: Story = {
    args: {
      label: "Email",
      placeholder: "Enter your email",
      disabled: true,
    },
  };

  export const Password: Story = {
    args: {
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
    },
  };

  export const NoLabel: Story = {
    args: { placeholder: "Search...", "aria-label": "Search" },
  };