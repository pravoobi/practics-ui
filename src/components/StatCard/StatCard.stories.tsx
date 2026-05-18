import type { Meta, StoryObj } from "@storybook/react";
  import { StatCard } from "./StatCard";

  const meta: Meta<typeof StatCard> = {
    title: "Components/StatCard",
    component: StatCard,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof StatCard>;

  export const Default: Story = {
    render: () => (
      <div style={{ width: "280px" }}>
        <StatCard label="Total Revenue" value="$45,231" />
      </div>
    ),
  };

  export const WithTrendUp: Story = {
    render: () => (
      <div style={{ width: "280px" }}>
        <StatCard
          label="Total Revenue"
          value="$45,231"
          change="+20.1% from last month"
          trend="up"
        />
      </div>
    ),
  };

  export const WithTrendDown: Story = {
    render: () => (
      <div style={{ width: "280px" }}>
        <StatCard
          label="Churn Rate"
          value="3.2%"
          change="+0.4% from last month"
          trend="down"
        />
      </div>
    ),
  };

  export const WithTrendNeutral: Story = {
    render: () => (
      <div style={{ width: "280px" }}>
        <StatCard
          label="Active Sessions"
          value="1,024"
          change="no change"
          trend="neutral"
        />
      </div>
    ),
  };

  export const WithIcon: Story = {
    render: () => (
      <div style={{ width: "280px" }}>
        <StatCard
          label="Total Users"
          value="12,456"
          change="+180 this week"
          trend="up"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      </div>
    ),
  };

  export const Dashboard: Story = {
    render: () => (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 280px)", gap: "16px" }}>
        <StatCard label="Total Revenue" value="$45,231" change="+20.1%" trend="up" />
        <StatCard label="Subscriptions" value="+2,350" change="+180 this month" trend="up" />
        <StatCard label="Churn Rate" value="3.2%" change="+0.4%" trend="down" />
      </div>
    ),
  };