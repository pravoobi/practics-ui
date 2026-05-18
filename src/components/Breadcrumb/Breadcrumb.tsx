import * as React from "react";
  import {
    Breadcrumb as BreadcrumbPrimitive,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import type { BreadcrumbProps } from "./Breadcrumb.types";

  const Breadcrumb = ({ items, separator, className, maxItems }: BreadcrumbProps) => {
    const [expanded, setExpanded] = React.useState(false);
    const shouldCollapse = maxItems !== undefined && items.length > maxItems && !expanded;

    return (
      <BreadcrumbPrimitive>
        <BreadcrumbList className={className}>
          {shouldCollapse ? (
            <>
              <BreadcrumbItem>
                {items[0].href ? (
                  <BreadcrumbLink href={items[0].href}>{items[0].label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{items[0].label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              <BreadcrumbItem>
                <button
                  onClick={() => setExpanded(true)}
                  aria-label="Show more breadcrumbs"
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  ···
                </button>
              </BreadcrumbItem>
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{items[items.length - 1].label}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {isLast || !item.href ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                  )}
                </React.Fragment>
              );
            })
          )}
        </BreadcrumbList>
      </BreadcrumbPrimitive>
    );
  };
  Breadcrumb.displayName = "Breadcrumb";

  export { Breadcrumb, BreadcrumbLink, BreadcrumbPage, BreadcrumbItem, BreadcrumbSeparator };