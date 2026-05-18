import type { Meta, StoryObj } from "@storybook/react";
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

  const meta: Meta<typeof Tabs> = {
    title: "Components/Tabs",
    component: Tabs,
    tags: ["autodocs"],
  };

  export default meta;
  type Story = StoryObj<typeof Tabs>;

  export const Default: Story = {
    render: () => (
      <Tabs
        items={[
          { value: "account", label: "Account", content: <p className="text-sm">Account settings go here.</p> },
          { value: "password", label: "Password", content: <p className="text-sm">Password settings go here.</p> },
          { value: "notifications", label: "Notifications", content: <p className="text-sm">Notification preferences go here.</p> },
        ]}
      />
    ),
  };

  export const WithDefaultValue: Story = {
    render: () => (
      <Tabs
        defaultValue="password"
        items={[
          { value: "account", label: "Account", content: <p className="text-sm">Account content.</p> },
          { value: "password", label: "Password", content: <p className="text-sm">Password content — active by default.</p> },
          { value: "notifications", label: "Notifications", content: <p className="text-sm">Notifications content.</p> },
        ]}
      />
    ),
  };

  export const WithDisabledTab: Story = {
    render: () => (
      <Tabs
        items={[
          { value: "active", label: "Active", content: <p className="text-sm">Active tab content.</p> },
          { value: "disabled", label: "Disabled", disabled: true, content: <p className="text-sm">You cannot see this.</p> },
          { value: "other", label: "Other", content: <p className="text-sm">Other tab content.</p> },
        ]}
      />
    ),
  };

  export const ManualComposition: Story = {
    render: () => (
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-sm mt-4">Overview content with custom layout.</p>
        </TabsContent>
        <TabsContent value="analytics">
          <p className="text-sm mt-4">Analytics content with custom layout.</p>
        </TabsContent>
      </Tabs>
    ),
  };

  export const ManyTabs: Story = {
    render: () => (
      <div style={{ width: "320px" }}>
        <Tabs
          items={[
            { value: "home", label: "Home", content: <p className="text-sm mt-2">Home content.</p> },
            { value: "profile", label: "Profile", content: <p className="text-sm mt-2">Profile content.</p> },
            { value: "settings", label: "Settings", content: <p className="text-sm mt-2">Settings content.</p> },
            { value: "notifications", label: "Notifications", content: <p className="text-sm mt-2">Notifications content.</p> },
            { value: "billing", label: "Billing", content: <p className="text-sm mt-2">Billing content.</p> },
            { value: "security", label: "Security", content: <p className="text-sm mt-2">Security content.</p> },
          ]}
        />
      </div>
    ),
  };
