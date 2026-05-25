import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog";

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  title: "Delete record",
  description: "This action cannot be undone.",
  onConfirm: vi.fn(),
};

describe("ConfirmDialog — rendering", () => {
  it("renders title and description when open", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Delete record")).toBeTruthy();
    expect(screen.getByText("This action cannot be undone.")).toBeTruthy();
  });

  it("renders default Confirm and Cancel buttons", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  });

  it("renders custom button labels", () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="Yes, delete"
        cancelLabel="Keep it"
      />
    );
    expect(screen.getByRole("button", { name: "Yes, delete" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Keep it" })).toBeTruthy();
  });

  it("does not render when open is false", () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText("Delete record")).toBeNull();
  });
});

describe("ConfirmDialog — interactions", () => {
  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel and onOpenChange(false) when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        {...defaultProps}
        onCancel={onCancel}
        onOpenChange={onOpenChange}
      />
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) without onCancel when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        {...defaultProps}
        onOpenChange={onOpenChange}
        onCancel={undefined}
      />
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("ConfirmDialog — loading state", () => {
  it("disables cancel button while loading", () => {
    render(<ConfirmDialog {...defaultProps} loading />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("confirm button shows loading indicator while loading", () => {
    render(<ConfirmDialog {...defaultProps} loading />);
    const confirmBtn = screen.getByRole("button", { name: "Confirm" });
    expect(confirmBtn).toHaveAttribute("aria-busy", "true");
  });
});
