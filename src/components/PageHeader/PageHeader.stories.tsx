import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <PageHeader title="Dashboard" />
    </div>
  ),
};

export const WithEyebrow: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <PageHeader eyebrow="Analytics" title="Dashboard" />
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <PageHeader title="Projects" action={{ label: "New project", onClick: () => {} }} />
    </div>
  ),
};

export const Full: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <PageHeader
        eyebrow="Team workspace"
        title="Projects"
        action={{
          label: "New project",
          onClick: () => {},
          icon: <PlusIcon />,
        }}
      />
    </div>
  ),
};
