import type { Meta, StoryObj } from "@storybook/react";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from "./Card";
  import { Button } from "@/components/Button";

  const meta: Meta<typeof Card> = {
    title: "Components/Card",
    component: Card,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Card>;

  export const Default: Story = {
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the card body content.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
    ),
  };

  export const Outline: Story = {
    render: () => (
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Outline Card</CardTitle>
          <CardDescription>Uses a thicker border, no shadow.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content inside an outline card.</p>
        </CardContent>
      </Card>
    ),
  };

  export const Ghost: Story = {
    render: () => (
      <Card variant="ghost">
        <CardHeader>
          <CardTitle>Ghost Card</CardTitle>
          <CardDescription>Transparent background, no border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content inside a ghost card.</p>
        </CardContent>
      </Card>
    ),
  };

  export const WithCustomPadding: Story = {
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Custom Padding</CardTitle>
        </CardHeader>
        <CardContent padding={2}>
          <p>CardContent with tight padding via the padding prop.</p>
        </CardContent>
      </Card>
    ),
  };

  export const HeaderOnly: Story = {
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Header Only</CardTitle>
          <CardDescription>No content or footer.</CardDescription>
        </CardHeader>
      </Card>
    ),
  };

  export const AllVariants: Story = {
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {(["default", "outline", "ghost"] as const).map((variant) => (
          <Card key={variant} variant={variant}>
            <CardHeader>
              <CardTitle>{variant}</CardTitle>
              <CardDescription>variant="{variant}"</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card body content.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  };