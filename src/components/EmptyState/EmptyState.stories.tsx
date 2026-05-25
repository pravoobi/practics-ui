import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

const InboxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <div style={{ border: "1px dashed #e2e8f0", borderRadius: "8px" }}>
      <EmptyState title="No items yet" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div style={{ border: "1px dashed #e2e8f0", borderRadius: "8px" }}>
      <EmptyState
        title="Your inbox is empty"
        description="Messages from your team will appear here once they've been sent."
      />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ border: "1px dashed #e2e8f0", borderRadius: "8px" }}>
      <EmptyState
        icon={<InboxIcon />}
        title="Your inbox is empty"
        description="Messages from your team will appear here once they've been sent."
      />
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div style={{ border: "1px dashed #e2e8f0", borderRadius: "8px" }}>
      <EmptyState
        icon={<SearchIcon />}
        title="No results found"
        description="Try adjusting your search or filters to find what you're looking for."
        action={{ label: "Clear filters", onClick: () => {} }}
      />
    </div>
  ),
};

export const Full: Story = {
  render: () => (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        maxWidth: "480px",
      }}
    >
      <EmptyState
        icon={<InboxIcon />}
        title="Nothing here yet"
        description="Create your first item to get started. It only takes a few seconds."
        action={{ label: "Create item", onClick: () => {} }}
      />
    </div>
  ),
};
