import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
  } from "./Dialog";
  import { Button } from "@/components/Button";

  describe("Dialog — closed state", () => {
    it("does not render content when closed", () => {
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogContent>
        </Dialog>
      );
      expect(screen.queryByText("Title")).toBeNull();
    });
  });

  describe("Dialog — open state", () => {
    it("renders content when open is true", () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>My Dialog</DialogTitle>
            <DialogDescription>Dialog description.</DialogDescription>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("My Dialog")).toBeTruthy();
      expect(screen.getByRole("dialog")).toBeTruthy();
    });

    it("renders title and description", () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Header Title</DialogTitle>
              <DialogDescription>Header description.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("Header Title")).toBeTruthy();
      expect(screen.getByText("Header description.")).toBeTruthy();
    });
  });

  describe("Dialog — controlled", () => {
    it("calls onOpenChange when trigger is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogContent>
        </Dialog>
      );
      await user.click(screen.getByText("Open"));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Dialog — trigger and close", () => {
    it("opens when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Opened</DialogTitle>
            <DialogDescription>Content visible.</DialogDescription>
          </DialogContent>
        </Dialog>
      );
      await user.click(screen.getByText("Open Dialog"));
      expect(screen.getByText("Opened")).toBeTruthy();
    });
  });

  describe("Dialog — composition", () => {
    it("renders full dialog structure", () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>Are you sure?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("Confirm Action")).toBeTruthy();
      expect(screen.getByText("Are you sure?")).toBeTruthy();
      expect(screen.getByText("Cancel")).toBeTruthy();
    });
  });