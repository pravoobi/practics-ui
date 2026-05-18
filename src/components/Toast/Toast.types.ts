import * as React from "react";
  import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

  export type ToastVariant = "default" | "success" | "warning" | "destructive" | "info";

  export interface ToastOptions {
    title?: React.ReactNode;
    description?: React.ReactNode;
    variant?: ToastVariant;
    action?: ToastActionElement;
    duration?: number;
  }

  export interface ToasterProps {
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  }

  export type { ToastProps };