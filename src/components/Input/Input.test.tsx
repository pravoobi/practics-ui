import * as React from "react";
  import { render, screen, waitFor, act } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { axe } from "vitest-axe";
  import { Mail, Search } from "lucide-react";
  import { Input } from "./Input";

  const AXE_CONFIG = {
    rules: { "color-contrast": { enabled: false } },
  };

  // --- Rendering ---
  describe("Input — rendering", () => {
    it("renders with a label", () => {
      render(<Input label="Email" />);
      expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    });

    it("label is associated with the input", () => {
      render(<Input label="Email" />);
      const input = screen.getByRole("textbox", { name: "Email" });
      expect(input).toHaveAttribute("id");
      expect(
        screen.getByText("Email").closest("label")
      ).toHaveAttribute("for", input.id);
    });

    it("forwards ref to the DOM input", () => {
      const ref = { current: null };
      render(<Input label="Email" ref={ref} />);
      expect(ref.current).not.toBeNull();
    });

    it("renders without a label using aria-label", () => {
      render(<Input aria-label="Search" placeholder="Search..." />);
      expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    });
  });

  // --- Helper text ---
  describe("Input — helperText", () => {
    it("renders helper text", () => {
      render(<Input label="Email" helperText="We'll never share your email." />);
      expect(
        screen.getByText("We'll never share your email.")
      ).toBeInTheDocument();
    });

    it("hides helper text when error is present", () => {
      render(
        <Input
          label="Email"
          helperText="We'll never share your email."
          error="Email is required."
        />
      );
      expect(
        screen.queryByText("We'll never share your email.")
      ).not.toBeInTheDocument();
    });
  });

  // --- Error state ---
  describe("Input — error", () => {
    it("renders error message", () => {
      render(<Input label="Email" error="Email is required." />);
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
    });

    it("sets aria-invalid when error is present", () => {
      render(<Input label="Email" error="Email is required." />);
      expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("sets aria-describedby pointing to error message", () => {
      render(<Input label="Email" error="Email is required." />);
      const input = screen.getByRole("textbox", { name: "Email" });
      const errorId = input.getAttribute("aria-describedby");
      expect(document.getElementById(errorId!)).toHaveTextContent(
        "Email is required."
      );
    });
  });

  // --- Icons ---
  describe("Input — icons", () => {
    it("renders iconLeft", () => {
      render(<Input label="Email" iconLeft={<Mail aria-label="mail icon" />} />);
      expect(screen.getByLabelText("mail icon")).toBeInTheDocument();
    });

    it("renders iconRight", () => {
      render(
        <Input label="Search" iconRight={<Search aria-label="search icon" />} />
      );
      expect(screen.getByLabelText("search icon")).toBeInTheDocument();
    });
  });

  // --- Disabled ---
  describe("Input — disabled", () => {
    it("is disabled when disabled prop is passed", () => {
      render(<Input label="Email" disabled />);
      expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled();
    });
  });

  // --- Keyboard interactions ---
  describe("Input — keyboard", () => {
    it("can be focused with Tab", async () => {
      const user = userEvent.setup();
      render(<Input label="Email" />);
      await user.tab();
      expect(screen.getByRole("textbox", { name: "Email" })).toHaveFocus();
    });

    it("accepts typed text", async () => {
      const user = userEvent.setup();
      render(<Input label="Email" />);
      const input = screen.getByRole("textbox", { name: "Email" });
      await user.type(input, "hello@example.com");
      expect(input).toHaveValue("hello@example.com");
    });

    it("does not accept input when disabled", async () => {
      const user = userEvent.setup();
      render(<Input label="Email" disabled />);
      const input = screen.getByRole("textbox", { name: "Email" });
      await user.type(input, "hello");
      expect(input).toHaveValue("");
    });
  });

  // --- Async state transitions ---
  describe("Input — async", () => {
    it("shows error message after state update", async () => {
      let setError!: (v: string) => void;
      const Wrapper = () => {
        const [error, setE] = React.useState("");
        setError = setE;
        return <Input label="Email" error={error || undefined} />;
      };
      render(<Wrapper />);
      expect(screen.queryByText("Email is required.")).not.toBeInTheDocument();
      act(() => setError("Email is required."));
      await waitFor(() =>
        expect(screen.getByText("Email is required.")).toBeInTheDocument()
      );
    });
  });

  // --- Accessibility ---
  describe("Input — accessibility", () => {
    it("passes axe audit with label", async () => {
      const { container } = render(<Input label="Email" />);
      expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
    });

    it("passes axe audit with error", async () => {
      const { container } = render(
        <Input label="Email" error="Email is required." />
      );
      expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
    });

    it("input without label or aria-label fails axe audit", async () => {
      const { container } = render(<Input />);
      const results = await axe(container, AXE_CONFIG);
      expect(results.violations.length).toBeGreaterThan(0);
    });
  });