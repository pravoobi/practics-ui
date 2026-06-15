import * as React from "react";
  import {
    Dialog as DialogPrimitive,
    DialogTrigger,
    DialogClose,
    DialogContent as DialogContentPrimitive,
    DialogHeader as DialogHeaderPrimitive,
    DialogFooter as DialogFooterPrimitive,
    DialogTitle as DialogTitlePrimitive,
    DialogDescription as DialogDescriptionPrimitive,
  } from "@/components/ui/dialog";
  import { cn } from "@/lib/utils";
  import type {
    DialogProps,
    DialogContentProps,
    DialogHeaderProps,
    DialogFooterProps,
    DialogTitleProps,
    DialogDescriptionProps,
  } from "./Dialog.types";

  const Dialog = ({ open, onOpenChange, children }: DialogProps) => (
    <DialogPrimitive open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive>
  );
  Dialog.displayName = "Dialog";

  const DialogContent = ({ ref, className, ...props }: DialogContentProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <DialogContentPrimitive ref={ref} className={className} {...props} />
    );
  DialogContent.displayName = "DialogContent";

  const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
    <DialogHeaderPrimitive className={className} {...props} />
  );
  DialogHeader.displayName = "DialogHeader";

  const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
    <DialogFooterPrimitive className={className} {...props} />
  );
  DialogFooter.displayName = "DialogFooter";

  const DialogTitle = ({ ref, className, ...props }: DialogTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => (
      <DialogTitlePrimitive ref={ref} className={className} {...props} />
    );
  DialogTitle.displayName = "DialogTitle";

  const DialogDescription = ({ ref, className, ...props }: DialogDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => (
      <DialogDescriptionPrimitive ref={ref} className={className} {...props} />
    );
  DialogDescription.displayName = "DialogDescription";

  export {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
  };
