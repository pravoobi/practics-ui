import React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
  import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarNav,
    NavItem,
    NavGroup,
  } from "./Sidebar";

  const meta: Meta<typeof Sidebar> = {
    title: "Components/Sidebar",
    component: Sidebar,
    tags: ["autodocs"],
    decorators: [
      (Story) => (
        <div style={{ height: "500px", display: "flex" }}>
          <Story />
        </div>
      ),
    ],
  };

  export default meta;
  type Story = StoryObj<typeof Sidebar>;

  const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1
  1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0
   0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1
  1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  export const Default: Story = {
    render: () => (
      <Sidebar>
        <SidebarHeader>
          <span className="font-semibold">My App</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav>
            <NavItem href="/home" icon={<HomeIcon />} isActive>Home</NavItem>
            <NavItem href="/settings" icon={<SettingsIcon />}>Settings</NavItem>
          </SidebarNav>
        </SidebarContent>
        <SidebarFooter>
          <span className="text-sm text-muted-foreground">v1.0.0</span>
        </SidebarFooter>
      </Sidebar>
    ),
  };

  export const WithGroups: Story = {
    render: () => (
      <Sidebar>
        <SidebarHeader>
          <span className="font-semibold">Dashboard</span>
        </SidebarHeader>
        <SidebarContent>
          <NavGroup
            group={{
              label: "Main",
              items: [
                { label: "Home", href: "/home", isActive: true, icon: <HomeIcon /> },
                { label: "Analytics", href: "/analytics" },
              ],
            }}
          />
          <NavGroup
            group={{
              label: "System",
              items: [
                { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
                { label: "Disabled", href: "/disabled", disabled: true },
              ],
            }}
          />
        </SidebarContent>
      </Sidebar>
    ),
  };

  export const WithBadges: Story = {
    render: () => (
      <Sidebar>
        <SidebarHeader>
          <span className="font-semibold">My App</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav>
            <NavItem href="/home" isActive>Home</NavItem>
            <NavItem href="/inbox" badge={5}>Inbox</NavItem>
            <NavItem href="/notifications" badge={99}>Notifications</NavItem>
            <NavItem href="/archive" badge={0}>Archive</NavItem>
          </SidebarNav>
        </SidebarContent>
      </Sidebar>
    ),
  };

   export const MobileDrawer: Story = {
    render: () => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <div style={{ height: "500px", position: "relative", overflow: "hidden" }}>
          <button
            onClick={() => setIsOpen(true)}
            style={{ margin: "16px", padding: "8px 16px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            ☰ Open Sidebar
          </button>
          <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <SidebarHeader>
              <span className="font-semibold">My App</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav>
                <NavItem href="/home" icon={<span>🏠</span>} isActive>Home</NavItem>
                <NavItem href="/settings" icon={<span>⚙️</span>}>Settings</NavItem>
              </SidebarNav>
            </SidebarContent>
            <SidebarFooter>
              <span className="text-sm text-muted-foreground">v1.0.0</span>
            </SidebarFooter>
          </Sidebar>
        </div>
      );
    },
  };