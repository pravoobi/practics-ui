import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";

describe("EmptyState — rendering", () => {
  it("renders the title", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText("No results found")).toBeTruthy();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your filters."
      />
    );
    expect(screen.getByText("Try adjusting your filters.")).toBeTruthy();
  });

  it("does not render description when omitted", () => {
    render(<EmptyState title="No results" />);
    expect(screen.queryByText("Try adjusting your filters.")).toBeNull();
  });

  it("renders icon when provided", () => {
    render(
      <EmptyState
        title="No results"
        icon={<span data-testid="custom-icon">icon</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeTruthy();
  });

  it("does not render icon slot when icon is omitted", () => {
    render(<EmptyState title="No results" />);
    expect(screen.queryByTestId("custom-icon")).toBeNull();
  });

  it("renders action button when action is provided", () => {
    render(
      <EmptyState
        title="No results"
        action={{ label: "Add item", onClick: () => {} }}
      />
    );
    expect(screen.getByRole("button", { name: "Add item" })).toBeTruthy();
  });

  it("does not render button when action is omitted", () => {
    render(<EmptyState title="No results" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("forwards ref to the wrapper div", () => {
    const ref = { current: null };
    render(<EmptyState ref={ref} title="No results" />);
    expect(ref.current).not.toBeNull();
  });

  it("merges consumer className", () => {
    const { container } = render(
      <EmptyState title="No results" className="my-custom" />
    );
    expect(container.firstChild).toHaveClass("my-custom");
  });
});

describe("EmptyState — action", () => {
  it("calls action.onClick when button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        title="No results"
        action={{ label: "Add item", onClick }}
      />
    );
    await user.click(screen.getByRole("button", { name: "Add item" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
