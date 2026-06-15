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

  const Sidebar = ({ ref, className, isOpen, onClose, ...props }: SidebarProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <SidebarPrimitive ref={ref} className={className} isOpen={isOpen} onClose={onClose} {...props} />
    );
  Sidebar.displayName = "Sidebar";

  const SidebarHeader = ({ ref, className, ...props }: SidebarHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <SidebarHeaderPrimitive ref={ref} className={className} {...props} />
    );
  SidebarHeader.displayName = "SidebarHeader";

  const SidebarContent = ({ ref, className, ...props }: SidebarContentProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <SidebarContentPrimitive ref={ref} className={className} {...props} />
    );
  SidebarContent.displayName = "SidebarContent";

  const SidebarFooter = ({ ref, className, ...props }: SidebarFooterProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <SidebarFooterPrimitive ref={ref} className={className} {...props} />
    );
  SidebarFooter.displayName = "SidebarFooter";

  const NavItem = ({ ref, icon, badge, isActive, disabled, asChild, className, children, ...props }: NavItemProps & { ref?: React.Ref<HTMLAnchorElement> }) => {
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
    };
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