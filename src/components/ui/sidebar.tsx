import * as React from "react";
  import { cn } from "@/lib/utils";

  const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
      isOpen?: boolean;
      onClose?: () => void;
    }
  >(({ className, isOpen, onClose, children, ...props }, ref) => {
    const isDrawerMode = onClose !== undefined;
    return (
      <>
        {isDrawerMode && (
          <div
            className={cn(
              "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <div
          ref={ref}
          className={cn(
            "flex h-full w-64 flex-col border-r border-border bg-background",
            isDrawerMode && [
              "fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:relative md:z-auto md:translate-x-0",
              isOpen ? "translate-x-0" : "-translate-x-full",
            ],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    );
  });
  Sidebar.displayName = "Sidebar";

  const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-14 items-center border-b border-border px-4", className)}
      {...props}
    />
  ));
  SidebarHeader.displayName = "SidebarHeader";

  const SidebarContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto py-2", className)}
      {...props}
    />
  ));
  SidebarContent.displayName = "SidebarContent";

  const SidebarFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t border-border p-4", className)}
      {...props}
    />
  ));
  SidebarFooter.displayName = "SidebarFooter";

  const SidebarNav = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
  >(({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("flex flex-col gap-1 px-2", className)}
      {...props}
    />
  ));
  SidebarNav.displayName = "SidebarNav";

  const SidebarNavItem = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      isActive?: boolean;
      asChild?: boolean;
    }
  >(({ className, isActive, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground",
        className
      )}
      {...props}
    />
  ));
  SidebarNavItem.displayName = "SidebarNavItem";

  const SidebarNavGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mb-4", className)}
      {...props}
    />
  ));
  SidebarNavGroup.displayName = "SidebarNavGroup";

  const SidebarNavGroupLabel = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >(({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}
      {...props}
    />
  ));
  SidebarNavGroupLabel.displayName = "SidebarNavGroupLabel";

  export {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarNav,
    SidebarNavItem,
    SidebarNavGroup,
    SidebarNavGroupLabel,
  };