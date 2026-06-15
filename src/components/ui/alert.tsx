import * as React from "react";
  import { cva, type VariantProps } from "class-variance-authority";
  import { cn } from "@/lib/utils";

  const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
    {
      variants: {
        variant: {
          default: "bg-background text-foreground border-border",
          destructive:
            "border-destructive/50 text-destructive [&>svg]:text-destructive",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );

  const Alert = ({ ref, className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
  Alert.displayName = "Alert";

  const AlertTitle = ({ ref, className, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLParagraphElement> }) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
  AlertTitle.displayName = "AlertTitle";

  const AlertDescription = ({ ref, className, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }) => (
    <p
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
  AlertDescription.displayName = "AlertDescription";

  export { Alert, AlertTitle, AlertDescription, alertVariants };