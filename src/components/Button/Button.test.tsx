import * as React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "./Button";

const AXE_CONFIG = {
  rules: { "color-contrast": { enabled: false } },
};

// --- Rendering ---
describe("Button — rendering", () => {
  it("renders with a label", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("forwards ref to the DOM button", () => {
    const ref = { current: null };
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).not.toBeNull();
  });
});

// --- Loading state ---
describe("Button — loading", () => {
  it("is disabled while loading", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("sets aria-busy while loading", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole("button", { name: /save/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("shows a spinner while loading", () => {
    render(<Button loading>Save</Button>);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("hides iconLeft while loading", () => {
    render(
      <Button loading iconLeft={<Mail data-testid="icon" />}>
        Save
      </Button>,
    );
    expect(
      document.querySelector("[data-testid='icon']"),
    ).not.toBeInTheDocument();
  });
});

// --- Icons ---
describe("Button — icons", () => {
  it("renders iconLeft", () => {
    render(<Button iconLeft={<Mail aria-label="mail" />}>Send</Button>);
    expect(screen.getByLabelText("mail")).toBeInTheDocument();
  });

  it("renders iconRight", () => {
    render(<Button iconRight={<ArrowRight aria-label="next" />}>Next</Button>);
    expect(screen.getByLabelText("next")).toBeInTheDocument();
  });

  it("hides iconRight while loading", () => {
    render(
      <Button loading iconRight={<ArrowRight aria-label="next" />}>
        Next
      </Button>,
    );
    expect(screen.queryByLabelText("next")).not.toBeInTheDocument();
  });
});

// --- Disabled ---
describe("Button — disabled", () => {
  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});

// --- Keyboard interactions ---
describe("Button — keyboard", () => {
  it("can be focused with Tab", async () => {
    const user = userEvent.setup();
    render(<Button>Save</Button>);
    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  });

  it("calls onClick on Space", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    screen.getByRole("button", { name: "Save" }).focus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick on Enter", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    screen.getByRole("button", { name: "Save" }).focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// --- Async state transitions ---
describe("Button — async", () => {
  it("becomes disabled after loading starts", async () => {
    let setLoading!: (v: boolean) => void;
    const Wrapper = () => {
      const [loading, setL] = React.useState(false);
      setLoading = setL;
      return <Button loading={loading}>Save</Button>;
    };
    render(<Wrapper />);
    expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
    act(() => setLoading(true));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeDisabled(),
    );
  });
});

// --- Accessibility ---
describe("Button — accessibility", () => {
  it("passes axe audit", async () => {
    const { container } = render(<Button>Save</Button>);
    expect(await axe(container, AXE_CONFIG)).toHaveNoViolations();
  });

  it("icon-only button without aria-label fails axe audit", async () => {
    const { container } = render(
      <Button size="icon">
        <Mail />
      </Button>,
    );
    const results = await axe(container, AXE_CONFIG);
    expect(results.violations.length).toBeGreaterThan(0);
  });
});
