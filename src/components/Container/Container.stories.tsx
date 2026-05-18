import type { Meta, StoryObj } from "@storybook/react";
  import { Container } from "./Container";

  const meta: Meta<typeof Container> = {
    title: "Layout/Container",
    component: Container,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Container>;

  const Content = () => (
    <div
      style={{
        background: "hsl(var(--muted))",
        padding: "16px",
        borderRadius: "4px",
        fontSize: "14px",
        textAlign: "center",
      }}
    >
      Container content
    </div>
  );

  export const Small: Story = {
    render: () => (
      <Container size="sm">
        <Content />
      </Container>
    ),
  };

  export const Medium: Story = {
    render: () => (
      <Container size="md">
        <Content />
      </Container>
    ),
  };

  export const Large: Story = {
    render: () => (
      <Container size="lg">
        <Content />
      </Container>
    ),
  };

  export const ExtraLarge: Story = {
    render: () => (
      <Container size="xl">
        <Content />
      </Container>
    ),
  };

  export const Full: Story = {
    render: () => (
      <Container size="full">
        <Content />
      </Container>
    ),
  };

  export const WithPadding: Story = {
    render: () => (
      <Container size="lg" paddingX={6} paddingY={4}>
        <Content />
      </Container>
    ),
  };

  export const AsMain: Story = {
    render: () => (
      <Container as="main" size="lg" paddingY={6}>
        <Content />
      </Container>
    ),
  };