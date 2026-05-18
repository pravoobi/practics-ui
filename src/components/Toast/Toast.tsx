 import * as React from "react";
  import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
  } from "@/components/ui/toast";

  import { useToast, toast as toastPrimitive } from "@/components/ui/use-toast";
  import type { ToasterToast } from "@/components/ui/use-toast";
  import type { ToastOptions, ToasterProps, ToastVariant } from "./Toast.types";
  import { cn } from "@/lib/utils";


  const extraVariantMap: Record<string, string> = {
    success: "border-green-500/50 bg-green-50 text-green-900",
    warning: "border-yellow-500/50 bg-yellow-50 text-yellow-900",
    info: "border-blue-500/50 bg-blue-50 text-blue-900",
  };

  const positionMap: Record<NonNullable<ToasterProps["position"]>, string> = {
    "top-right": "top-0 right-0 sm:top-0 sm:right-0 sm:bottom-auto flex-col",
    "top-left": "top-0 left-0 sm:top-0 sm:left-0 sm:right-auto sm:bottom-auto flex-col",
    "bottom-right": "bottom-0 right-0 sm:bottom-0 sm:right-0 sm:top-auto flex-col-reverse",
    "bottom-left": "bottom-0 left-0 sm:bottom-0 sm:left-0 sm:right-auto sm:top-auto flex-col-reverse",
    "top-center": "top-0 left-1/2 -translate-x-1/2 sm:top-0 sm:bottom-auto flex-col",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 sm:bottom-0 sm:top-auto flex-col-reverse",
  };

  const Toaster = ({ position = "bottom-right" }: ToasterProps) => {
    const { toasts } = useToast();

    return (
      <ToastProvider>
        {toasts.map(({ id, title, description, action, variant: rawVariant, ...props }) => {
          const variant = rawVariant as ToastVariant | undefined;
          const isExtra = variant === "success" || variant === "warning" || variant === "info";
          return (
            <Toast
              key={id}
              variant={isExtra ? "default" : (variant as "default" | "destructive" | undefined)}
              className={isExtra ? extraVariantMap[variant as string] : undefined}
              {...props}
            >
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport className={cn("fixed z-[100] flex max-h-screen w-full p-4 md:max-w-[420px]", positionMap[position])} />
      </ToastProvider>
    );
  };

  const toast = (options: ToastOptions) =>
    toastPrimitive(options as Omit<ToasterToast, "id">);

  export { Toaster, toast };
  export { useToast } from "@/components/ui/use-toast";
  export type { ToasterToast } from "@/components/ui/use-toast";