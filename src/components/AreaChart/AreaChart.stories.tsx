import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart } from "./AreaChart";

const meta: Meta<typeof AreaChart> = {
  title: "Components/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AreaChart>;

const monthlyData = [
  { label: "Jan", revenue: 4200, users: 2400 },
  { label: "Feb", revenue: 5800, users: 3100 },
  { label: "Mar", revenue: 5200, users: 2900 },
  { label: "Apr", revenue: 7800, users: 4100 },
  { label: "May", revenue: 6900, users: 3700 },
  { label: "Jun", revenue: 9100, users: 4800 },
];

export const Default: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <AreaChart
        data={monthlyData}
        series={[{ key: "revenue", name: "Revenue", color: "#3b82f6" }]}
      />
    </div>
  ),
};

export const MultiSeries: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <AreaChart
        data={monthlyData}
        series={[
          { key: "revenue", name: "Revenue", color: "#3b82f6" },
          { key: "users", name: "Users", color: "#10b981" },
        ]}
      />
    </div>
  ),
};

export const NoGrid: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <AreaChart
        data={monthlyData}
        series={[{ key: "revenue", name: "Revenue", color: "#8b5cf6" }]}
        showGrid={false}
      />
    </div>
  ),
};

export const NoLegend: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <AreaChart
        data={monthlyData}
        series={[{ key: "revenue", name: "Revenue", color: "#f59e0b" }]}
        showLegend={false}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div style={{ width: "400px" }}>
      <AreaChart
        data={monthlyData}
        series={[{ key: "revenue", name: "Revenue", color: "#ef4444" }]}
        height={140}
        showLegend={false}
      />
    </div>
  ),
};
