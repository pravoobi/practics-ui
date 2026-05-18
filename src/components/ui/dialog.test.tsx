 import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from "./dialog";

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
    it("renders content when open prop is true", () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>My Dialog</DialogTitle>
            <DialogDescription>Dialog description.</DialogDescription>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("My Dialog")).toBeTruthy();
      expect(screen.getByText("Dialog description.")).toBeTruthy();
    });

    it("renders dialog role", () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByRole("dialog")).toBeTruthy();
    });
  });

  describe("Dialog — trigger", () => {
    it("opens dialog when trigger is clicked", async () => {
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
      expect(screen.queryByText("Opened")).toBeNull();
      await user.click(screen.getByText("Open Dialog"));
      expect(screen.getByText("Opened")).toBeTruthy();
    });
  });

  describe("Dialog — composition", () => {
    it("renders header, footer, title and description", () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>This cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByText("Confirm Action")).toBeTruthy();
      expect(screen.getByText("This cannot be undone.")).toBeTruthy();
      expect(screen.getByText("Cancel")).toBeTruthy();
    });
  });