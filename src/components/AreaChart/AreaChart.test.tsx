import { render, screen } from "@testing-library/react";
import { AreaChart } from "./AreaChart";

const data = [
  { label: "Jan", revenue: 400, users: 240 },
  { label: "Feb", revenue: 600, users: 320 },
  { label: "Mar", revenue: 500, users: 280 },
  { label: "Apr", revenue: 780, users: 410 },
];

const series = [
  { key: "revenue", name: "Revenue", color: "#3b82f6" },
  { key: "users", name: "Users", color: "#10b981" },
];

describe("AreaChart — rendering", () => {
  it("renders an SVG with role img", () => {
    render(<AreaChart data={data} series={series} />);
    expect(screen.getByRole("img", { name: "Area chart" })).toBeTruthy();
  });

  it("renders an area path and line path per series", () => {
    const { container } = render(<AreaChart data={data} series={series} />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(series.length * 2);
  });

  it("renders x-axis labels", () => {
    render(<AreaChart data={data} series={series} />);
    expect(screen.getByText("Jan")).toBeTruthy();
    expect(screen.getByText("Apr")).toBeTruthy();
  });

  it("forwards ref to the wrapper div", () => {
    const ref = { current: null };
    render(<AreaChart ref={ref} data={data} series={series} />);
    expect(ref.current).not.toBeNull();
  });

  it("merges consumer className", () => {
    const { container } = render(
      <AreaChart data={data} series={series} className="p-4" />
    );
    expect(container.firstChild).toHaveClass("p-4");
  });

  it("renders without crashing when data is empty", () => {
    render(<AreaChart data={[]} series={series} />);
    expect(screen.getByRole("img", { name: "Area chart" })).toBeTruthy();
  });
});

describe("AreaChart — legend", () => {
  it("renders series names in the legend by default", () => {
    render(<AreaChart data={data} series={series} />);
    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("Users")).toBeTruthy();
  });

  it("hides legend when showLegend is false", () => {
    render(<AreaChart data={data} series={series} showLegend={false} />);
    expect(screen.queryByText("Revenue")).toBeNull();
  });
});
