import { render, screen } from "@testing-library/react";
import { DonutChart } from "./DonutChart";

const segments = [
  { label: "Alpha", value: 50, color: "#3b82f6" },
  { label: "Beta", value: 30, color: "#10b981" },
  { label: "Gamma", value: 20, color: "#f59e0b" },
];

describe("DonutChart — rendering", () => {
  it("renders an SVG with role img", () => {
    render(<DonutChart segments={segments} />);
    expect(screen.getByRole("img", { name: "Donut chart" })).toBeTruthy();
  });

  it("renders a circle per segment plus the background ring", () => {
    const { container } = render(<DonutChart segments={segments} />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(segments.length + 1);
  });

  it("renders no segment circles when segments is empty", () => {
    const { container } = render(<DonutChart segments={[]} />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(1);
  });

  it("renders no segment circles when total is zero", () => {
    const { container } = render(
      <DonutChart segments={[{ label: "A", value: 0, color: "#000" }]} />
    );
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(1);
  });

  it("forwards ref to the wrapper div", () => {
    const ref = { current: null };
    render(<DonutChart ref={ref} segments={segments} />);
    expect(ref.current).not.toBeNull();
  });

  it("merges consumer className onto the wrapper div", () => {
    const { container } = render(
      <DonutChart segments={segments} className="mt-8" />
    );
    expect(container.firstChild).toHaveClass("mt-8");
  });
});

describe("DonutChart — center text", () => {
  it("renders centerText when provided", () => {
    render(<DonutChart segments={segments} centerText="72%" />);
    expect(screen.getByText("72%")).toBeTruthy();
  });

  it("renders centerSubtext when provided", () => {
    render(
      <DonutChart segments={segments} centerText="72%" centerSubtext="Score" />
    );
    expect(screen.getByText("Score")).toBeTruthy();
  });

  it("does not render centerText when omitted", () => {
    render(<DonutChart segments={segments} />);
    expect(screen.queryByText("72%")).toBeNull();
  });
});

describe("DonutChart — legend", () => {
  it("renders legend labels when showLegend is true", () => {
    render(<DonutChart segments={segments} showLegend />);
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Beta")).toBeTruthy();
    expect(screen.getByText("Gamma")).toBeTruthy();
  });

  it("does not render legend when showLegend is false (default)", () => {
    render(<DonutChart segments={segments} />);
    expect(screen.queryByText("Alpha")).toBeNull();
  });
});
