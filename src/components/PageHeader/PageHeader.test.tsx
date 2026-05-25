import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageHeader } from "./PageHeader";

describe("PageHeader — rendering", () => {
  it("renders the title", () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  it("renders eyebrow text when provided", () => {
    render(<PageHeader eyebrow="Overview" title="Dashboard" />);
    expect(screen.getByText("Overview")).toBeTruthy();
  });

  it("does not render eyebrow when omitted", () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.queryByText("Overview")).toBeNull();
  });

  it("renders action button when action is provided", () => {
    render(
      <PageHeader
        title="Dashboard"
        action={{ label: "New report", onClick: () => {} }}
      />
    );
    expect(screen.getByRole("button", { name: "New report" })).toBeTruthy();
  });

  it("does not render action button when action is omitted", () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("forwards ref to the wrapper div", () => {
    const ref = { current: null };
    render(<PageHeader ref={ref} title="Dashboard" />);
    expect(ref.current).not.toBeNull();
  });

  it("merges consumer className", () => {
    const { container } = render(
      <PageHeader title="Dashboard" className="mb-6" />
    );
    expect(container.firstChild).toHaveClass("mb-6");
  });
});

describe("PageHeader — action", () => {
  it("calls action.onClick when button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <PageHeader title="Dashboard" action={{ label: "New report", onClick }} />
    );
    await user.click(screen.getByRole("button", { name: "New report" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
