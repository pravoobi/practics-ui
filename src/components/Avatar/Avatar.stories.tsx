import type { Meta, StoryObj } from "@storybook/react";
  import { Avatar } from "./Avatar";

  const meta: Meta<typeof Avatar> = {
    title: "Components/Avatar",
    component: Avatar,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Avatar>;

  export const WithImage: Story = {
    render: () => (
      <Avatar
        src="https://github.com/shadcn.png"
        alt="shadcn"
        fallback="SC"
      />
    ),
  };

  export const WithFallback: Story = {
    render: () => <Avatar fallback="JD" alt="John Doe" />,
  };

  export const BrokenImage: Story = {
    render: () => (
      <Avatar
        src="https://broken.url/avatar.jpg"
        alt="Broken"
        fallback="BR"
      />
    ),
  };

  export const Sizes: Story = {
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} size={size} fallback="JD" alt="John Doe" />
        ))}
      </div>
    ),
  };

  export const WithCustomClass: Story = {
    render: () => (
      <Avatar fallback="AB" alt="Custom" className="ring-2 ring-primary" />
    ),
  };