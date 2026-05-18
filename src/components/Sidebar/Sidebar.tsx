 import * as React from "react";
  import { Slot } from "@radix-ui/react-slot";
  import {
    Sidebar as SidebarPrimitive,
    SidebarHeader as SidebarHeaderPrimitive,
    SidebarContent as SidebarContentPrimitive,
    SidebarFooter as SidebarFooterPrimitive,
    SidebarNav,
    SidebarNavItem as SidebarNavItemPrimitive,
    SidebarNavGroup as SidebarNavGroupPrimitive,
    SidebarNavGroupLabel,
  } from "@/components/ui/sidebar";
  import { Badge } from "@/components/Badge";
  import { cn } from "@/lib/utils";
  import type {
    SidebarProps,
    SidebarHeaderProps,
    SidebarContentProps,
    SidebarFooterProps,
    NavItemProps,
    NavGroupProps,
    NavGroupConfig,
  } from "./Sidebar.types";

  const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
    ({ className, isOpen, onClose, ...props }, ref) => (
      <SidebarPrimitive ref={ref} className={className} isOpen={isOpen} onClose={onClose} {...props} />
    )
  );
  Sidebar.displayName = "Sidebar";

  const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
    ({ className, ...props }, ref) => (
      <SidebarHeaderPrimitive ref={ref} className={className} {...props} />
    )
  );
  SidebarHeader.displayName = "SidebarHeader";

  const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
    ({ className, ...props }, ref) => (
      <SidebarContentPrimitive ref={ref} className={className} {...props} />
    )
  );
  SidebarContent.displayName = "SidebarContent";

  const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
    ({ className, ...props }, ref) => (
      <SidebarFooterPrimitive ref={ref} className={className} {...props} />
    )
  );
  SidebarFooter.displayName = "SidebarFooter";

  const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
    ({ icon, badge, isActive, disabled, asChild, className, children, ...props }, ref) => {
      const Comp = asChild ? Slot : SidebarNavItemPrimitive;
      return (
        <Comp
          ref={ref}
          isActive={isActive}
          className={cn(disabled && "pointer-events-none opacity-50", className)}
          {...props}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="flex-1 truncate">{children}</span>
          {badge !== undefined && (
            <Badge className="ml-auto shrink-0 text-xs">
              {badge}
            </Badge>
          )}
        </Comp>
      );
    }
  );
  NavItem.displayName = "NavItem";

  const NavGroup = ({ group, className }: NavGroupProps) => (
    <SidebarNavGroupPrimitive className={className}>
      {group.label && (
        <SidebarNavGroupLabel>{group.label}</SidebarNavGroupLabel>
      )}
      <SidebarNav>
        {group.items.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            badge={item.badge}
            isActive={item.isActive}
            disabled={item.disabled}
          >
            {item.label}
          </NavItem>
        ))}
      </SidebarNav>
    </SidebarNavGroupPrimitive>
  );
  NavGroup.displayName = "NavGroup";

  export {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarNav,
    NavItem,
    NavGroup,
  };