import type { Meta, StoryObj } from "@storybook/react";
  import { Box } from "./Box";

  const meta: Meta<typeof Box> = {
    title: "Layout/Box",
    component: Box,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Box>;

  const style = { background: "hsl(var(--muted))", minHeight: "40px" };

  export const Default: Story = {
    args: { children: "Default Box", style },
  };

  export const WithPadding: Story = {
    args: { children: "Padding 4", padding: 4, style },
  };

  export const WithPaddingXY: Story = {
    args: {
      children: "PaddingX 8, PaddingY 2",
      paddingX: 8,
      paddingY: 2,
      style,
    },
  };

  export const WithMargin: Story = {
    args: { children: "Margin 4", margin: 4, style },
  };

  export const AsFlex: Story = {
    args: {
      display: "flex",
      padding: 4,
      style,
      children: (
        <>
          <span>Item 1</span>
          <span>Item 2</span>
          <span>Item 3</span>
        </>
      ),
    },
  };

  export const AsSection: Story = {
    args: {
      as: "section",
      padding: 4,
      children: "Renders as a section element",
      style,
    },
  };

  export const AsMain: Story = {
    args: {
      as: "main",
      padding: 6,
      children: "Renders as main element",
      style,
    },
  };