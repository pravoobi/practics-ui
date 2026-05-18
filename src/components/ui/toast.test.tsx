 import { render, screen } from "@testing-library/react";
  import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
  } from "./toast";

  const ToastWrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  );

  describe("Toast — rendering", () => {
    it("renders toast with title", () => {
      render(
        <ToastWrapper>
          <Toast open>
            <ToastTitle>Toast Title</ToastTitle>
          </Toast>
        </ToastWrapper>
      );
      expect(screen.getByText("Toast Title")).toBeTruthy();
    });

    it("renders toast with description", () => {
      render(
        <ToastWrapper>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastDescription>Toast description text.</ToastDescription>
          </Toast>
        </ToastWrapper>
      );
      expect(screen.getByText("Toast description text.")).toBeTruthy();
    });

    it("does not render when open is false", () => {
      render(
        <ToastWrapper>
          <Toast open={false}>
            <ToastTitle>Hidden Toast</ToastTitle>
          </Toast>
        </ToastWrapper>
      );
      expect(screen.queryByText("Hidden Toast")).toBeNull();
    });
  });

  describe("Toast — variants", () => {
    it("applies default variant classes", () => {
      render(
        <ToastWrapper>
          <Toast open>
            <ToastTitle>Default</ToastTitle>
          </Toast>
        </ToastWrapper>
      );
      const toast = screen.getByText("Default").closest("[data-state]");
      expect(toast).toHaveClass("bg-background");
    });

    it("applies destructive variant classes", () => {
      render(
        <ToastWrapper>
          <Toast open variant="destructive">
            <ToastTitle>Error</ToastTitle>
          </Toast>
        </ToastWrapper>
      );
      const toast = screen.getByText("Error").closest("[data-state]");
      expect(toast).toHaveClass("bg-destructive");
    });
  });

  describe("Toast — composition", () => {
    it("renders with action", () => {
      render(
        <ToastWrapper>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Undo action">Undo</ToastAction>
          </Toast>
        </ToastWrapper>
      );
      expect(screen.getByText("Undo")).toBeTruthy();
    });

    it("renders close button", () => {
      render(
        <ToastWrapper>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
            <ToastClose />
          </Toast>
        </ToastWrapper>
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });