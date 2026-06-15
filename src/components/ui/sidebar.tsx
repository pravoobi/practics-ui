import * as React from "react";
  import { cn } from "@/lib/utils";

  const Sidebar = ({ ref, className, isOpen, onClose, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { isOpen?: boolean; onClose?: () => void; ref?: React.Ref<HTMLDivElement> }) => {
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
  };
  Sidebar.displayName = "Sidebar";

  const SidebarHeader = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      className={cn("flex h-14 items-center border-b border-border px-4", className)}
      {...props}
    />
  );
  SidebarHeader.displayName = "SidebarHeader";

  const SidebarContent = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto py-2", className)}
      {...props}
    />
  );
  SidebarContent.displayName = "SidebarContent";

  const SidebarFooter = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      className={cn("border-t border-border p-4", className)}
      {...props}
    />
  );
  SidebarFooter.displayName = "SidebarFooter";

  const SidebarNav = ({ ref, className, ...props }: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }) => (
    <nav
      ref={ref}
      className={cn("flex flex-col gap-1 px-2", className)}
      {...props}
    />
  );
  SidebarNav.displayName = "SidebarNav";

  const SidebarNavItem = ({ ref, className, isActive, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean; ref?: React.Ref<HTMLAnchorElement> }) => (
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
  );
  SidebarNavItem.displayName = "SidebarNavItem";

  const SidebarNavGroup = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      className={cn("mb-4", className)}
      {...props}
    />
  );
  SidebarNavGroup.displayName = "SidebarNavGroup";

  const SidebarNavGroupLabel = ({ ref, className, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) => (
    <p
      ref={ref}
      className={cn("mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}
      {...props}
    />
  );
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