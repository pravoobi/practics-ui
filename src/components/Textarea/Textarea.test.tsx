import * as React from "react";
  import { render, screen, waitFor, act } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { axe } from "vitest-axe";
  import { Textarea } from "./Textarea";

  const AXE_CONFIG = {
    rules: { "color-contrast": { enabled: false } },
  };

  // --- Rendering ---
  describe("Textarea — rendering", () => {
    it("renders with a label", () => {
      render(<Textarea label="Message" />);
      expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();
    });

    it("label is associated with the textarea", () => {
      render(<Textarea label="Message" />);
      const textarea = screen.getByRole("textbox", { name: "Message" });
      expect(textarea).toHaveAttribute("id");
      expect(
        screen.getByText("Message").closest("label")
      ).toHaveAttribute("for", textarea.id);
    });

    it("forwards ref to the DOM textarea", () => {
      const ref = { current: null };
      render(<Textarea label="Message" ref={ref} />);
      expect(ref.current).not.toBeNull();
    });

    it("renders without a label using aria-label", () => {
      render(<Textarea aria-label="Message" placeholder="Write something..." />);
      expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();
    });

    it("accepts rows prop", () => {
      render(<Textarea label="Message" rows={6} />);
      expect(screen.getByRole("textbox", { name: "Message" })).toHaveAttribute(
        "rows",
        "6"
      );
    });
  });

  // --- Helper text ---
  describe("Textarea — helperText", () => {
    it("renders helper text", () => {
      render(<Textarea label="Message" helperText="Maximum 500 characters." />);
      expect(screen.getByText("Maximum 500 characters.")).toBeInTheDocument();
    });

    it("hides helper text when error is present", () => {
      render(
        <Textarea
          label="Message"
          helperText="Maximum 500 characters."
          error="Message is required."
        />
      );
      expect(
        screen.queryByText("Maximum 500 characters.")
      ).not.toBeInTheDocument();
    });
  });

  // --- Error state ---
  describe("Textarea — error", () => {
    it("renders error message", () => {
      render(<Textarea label="Message" error="Message is required." />);
      expect(screen.getByText("Message is required.")).toBeInTheDocument();
    });

    it("sets aria-invalid when error is present", () => {
      render(<Textarea label="Message" error="Message is required." />);
      expect(
        screen.getByRole("textbox", { name: "Message" })
      ).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-describedby pointing to error message", () => {
      render(<Textarea label="Message" error="Message is required." />);
      const textarea = screen.getByRole("textbox", { name: "Message" });
      const errorId = textarea.getAttribute("aria-describedby");
      expect(document.getElementById(errorId!)).toHaveTextContent(
        "Message is required."
      );
    });
  });

  // --- Disabled ---
  describe("Textarea — disabled", () => {
    it("is disabled when disabled prop is passed", () => {
      render(<Textarea label="Message" disabled />);
      expect(
        screen.getByRole("textbox", { name: "Message" })
      ).toBeDisabled();
    });
  });

  // --- Keyboard interactions ---
  describe("Textarea — keyboard", () => {
    it("can be focused with Tab", async () => {
      const user = userEvent.setup();
      render(<Textarea label="Message" />);
      await user.tab();
      expect(
        screen.getByRole("textbox", { name: "Message" })
      ).toHaveFocus();
    });

    it("accepts typed text", async () => {
      const user = userEvent.setup();
      render(<Textarea label="Message" />);
      const textarea = screen.getByRole("textbox", { name: "Message" });
      await user.type(textarea, "Hello world");
      expect(textarea).toHaveValue("Hello world");
    });

    it("accepts multiline text", async () => {
      const user = userEvent.setup();
      render(<Textarea label="Message" />);
      const textarea = screen.getByRole("textbox", { name: "Message" });
      await user.type(textarea, "Line one{Enter}Line two");
      expect(textarea).toHaveValue("Line one\nLine two");
    });

    it("does not accept input when disabled", async () => {
      const user = userEvent.setup();
      render(<Textarea label="Message" disabled />);
      const textarea = screen.getByRole("textbox", { name: "Message" });
      await user.type(textarea, "hello");
      expect(textarea).toHaveValue("");
    });
  });

  // --- Async state transitions ---
  describe("Textarea — async", () => {
    it("shows error message after state update", async () => {
      let setError!: (v: string) => void;
      const Wrapper = () => {
        const [error, setE] = React.useState("");
        setError = setE;
        return <Textarea label="Message" error={error || undefined} />;
      };
      render(<Wrapper />);
      expect(screen.queryByText("Message is required.")).not.toBeInTheDocument();
      act(() => setError("Message is required."));
      await waitFor(() =>
        expect(screen.getByText("Message is required.")).toBeInTheDocument()
      );
    });
  });

  // --- Accessibility ---
  describe("Textarea — accessibility", () => {
    it("passes axe audit with label", async () => {
      const { container } = render(<Textarea label="Message" />);
      expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
    });

    it("passes axe audit with error", async () => {
      const { container } = render(
        <Textarea label="Message" error="Message is required." />
      );
      expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
    });

    it("textarea without label or aria-label fails axe audit", async () => {
      const { container } = render(<Textarea />);
      const results = await axe(container, AXE_CONFIG);
      expect(results.violations.length).toBeGreaterThan(0);
    });
  });