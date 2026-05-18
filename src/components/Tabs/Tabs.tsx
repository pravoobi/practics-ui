import * as React from "react";
  import {
    Tabs as TabsPrimitive,
    TabsList as TabsListPrimitive,
    TabsTrigger as TabsTriggerPrimitive,
    TabsContent as TabsContentPrimitive,
  } from "@/components/ui/tabs";
  import { cn } from "@/lib/utils";
  import type {
    TabsProps,
    TabsListProps,
    TabsTriggerProps,
    TabsContentProps,
  } from "./Tabs.types";

  const Tabs = ({
    items = [],
    defaultValue,
    value,
    onValueChange,
    className,
    children,
  }: TabsProps) => {
    const resolvedDefault = defaultValue ?? items[0]?.value;

    if (children) {
      return (
        <TabsPrimitive
          defaultValue={resolvedDefault}
          value={value}
          onValueChange={onValueChange}
        >
          {children}
        </TabsPrimitive>
      );
    }

    return (
      <TabsPrimitive
        defaultValue={resolvedDefault}
        value={value}
        onValueChange={onValueChange}
      >
        <TabsListPrimitive className={className}>
          {items.map((item) => (
            <TabsTriggerPrimitive
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </TabsTriggerPrimitive>
          ))}
        </TabsListPrimitive>
        {items.map((item) => (
          <TabsContentPrimitive key={item.value} value={item.value}>
            {item.content}
          </TabsContentPrimitive>
        ))}
      </TabsPrimitive>
    );
  };
  Tabs.displayName = "Tabs";

  const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, ...props }, ref) => (
      <TabsListPrimitive ref={ref} className={className} {...props} />
    )
  );
  TabsList.displayName = "TabsList";

  const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, ...props }, ref) => (
      <TabsTriggerPrimitive ref={ref} className={className} {...props} />
    )
  );
  TabsTrigger.displayName = "TabsTrigger";

  const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, ...props }, ref) => (
      <TabsContentPrimitive ref={ref} className={className} {...props} />
    )
  );
  TabsContent.displayName = "TabsContent";

  export { Tabs, TabsList, TabsTrigger, TabsContent };
