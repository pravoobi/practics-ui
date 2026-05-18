import type { Meta, StoryObj } from "@storybook/react";
  import { Breadcrumb } from "./Breadcrumb";

  const meta: Meta<typeof Breadcrumb> = {
    title: "Components/Breadcrumb",
    component: Breadcrumb,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Breadcrumb>;

  export const Default: Story = {
    render: () => (
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Laptops" },
        ]}
      />
    ),
  };

  export const TwoItems: Story = {
    render: () => (
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard" },
        ]}
      />
    ),
  };

  export const SingleItem: Story = {
    render: () => (
      <Breadcrumb items={[{ label: "Home" }]} />
    ),
  };

  export const CustomSeparator: Story = {
    render: () => (
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Profile" },
        ]}
        separator="›"
      />
    ),
  };

  export const DeepNesting: Story = {
    render: () => (
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Components", href: "/docs/components" },
          { label: "Breadcrumb", href: "/docs/components/breadcrumb" },
          { label: "Examples" },
        ]}
      />
    ),
  };

  export const Collapsed: Story = {
    render: () => (
      <Breadcrumb
        maxItems={3}
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Components", href: "/docs/components" },
          { label: "Breadcrumb", href: "/docs/components/breadcrumb" },
          { label: "Examples" },
        ]}
      />
    ),
  };