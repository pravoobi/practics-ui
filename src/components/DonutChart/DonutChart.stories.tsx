import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./DonutChart";

const meta: Meta<typeof DonutChart> = {
  title: "Components/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

const segments = [
  { label: "Direct", value: 42, color: "#3b82f6" },
  { label: "Organic", value: 28, color: "#10b981" },
  { label: "Referral", value: 18, color: "#f59e0b" },
  { label: "Social", value: 12, color: "#8b5cf6" },
];

export const Default: Story = {
  render: () => <DonutChart segments={segments} />,
};

export const WithCenterText: Story = {
  render: () => (
    <DonutChart segments={segments} centerText="72%" centerSubtext="Score" />
  ),
};

export const WithLegend: Story = {
  render: () => <DonutChart segments={segments} showLegend />,
};

export const WithCenterTextAndLegend: Story = {
  render: () => (
    <DonutChart
      segments={segments}
      centerText="100"
      centerSubtext="Total"
      showLegend
    />
  ),
};

export const TwoSegments: Story = {
  render: () => (
    <DonutChart
      segments={[
        { label: "Complete", value: 73, color: "#10b981" },
        { label: "Remaining", value: 27, color: "#e5e7eb" },
      ]}
      centerText="73%"
      centerSubtext="Complete"
      size={120}
      strokeWidth={16}
    />
  ),
};

export const Large: Story = {
  render: () => (
    <DonutChart segments={segments} size={240} strokeWidth={32} showLegend />
  ),
};

export const Empty: Story = {
  render: () => <DonutChart segments={[]} />,
};
