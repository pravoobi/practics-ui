import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

const fruitOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

export const Default: Story = {
  render: () => (
    <div style={{ width: "240px" }}>
      <Select options={fruitOptions} />
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <div style={{ width: "240px" }}>
      <Select options={fruitOptions} defaultValue="banana" />
    </div>
  ),
};

export const WithDisabledOption: Story = {
  render: () => (
    <div style={{ width: "240px" }}>
      <Select
        options={[
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana", disabled: true },
          { value: "cherry", label: "Cherry" },
        ]}
      />
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <div style={{ width: "240px" }}>
      <Select
        groups={[
          {
            label: "Fruits",
            options: [
              { value: "apple", label: "Apple" },
              { value: "banana", label: "Banana" },
            ],
          },
          {
            label: "Vegetables",
            options: [
              { value: "carrot", label: "Carrot" },
              { value: "broccoli", label: "Broccoli" },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: "240px" }}>
      <Select options={fruitOptions} disabled placeholder="Cannot select" />
    </div>
  ),
};

export const CustomPlaceholder: Story = {
  render: () => (
    <div style={{ width: "240px" }}>
      <Select options={fruitOptions} placeholder="Choose a fruit..." />
    </div>
  ),
};
