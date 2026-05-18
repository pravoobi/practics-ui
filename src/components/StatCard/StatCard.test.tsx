import { render } from "@testing-library/react";
  import { StatCard } from "./StatCard";

  describe("StatCard — rendering", () => {
    it("renders label and value", () => {
      const { getByText } = render(
        <StatCard label="Total Revenue" value="$45,231" />
      );
      expect(getByText("Total Revenue")).toBeTruthy();
      expect(getByText("$45,231")).toBeTruthy();
    });

    it("renders numeric value", () => {
      const { getByText } = render(
        <StatCard label="Users" value={1024} />
      );
      expect(getByText("1024")).toBeTruthy();
    });

    it("forwards ref", () => {
      const ref = { current: null };
      render(<StatCard ref={ref} label="Label" value="Value" />);
      expect(ref.current).not.toBeNull();
    });

    it("merges consumer className", () => {
      const { container } = render(
        <StatCard label="Label" value="Value" className="mt-4" />
      );
      expect(container.firstChild).toHaveClass("mt-4");
    });
  });

  describe("StatCard — change and trend", () => {
    it("renders change text when provided", () => {
      const { getByText } = render(
        <StatCard label="Revenue" value="$100" change="+20% this month" />
      );
      expect(getByText("+20% this month", { exact: false })).toBeTruthy();
    });

    it("does not render change row when change is omitted", () => {
      const { queryByText } = render(
        <StatCard label="Revenue" value="$100" />
      );
      expect(queryByText("%")).toBeNull();
    });

    it("applies up trend color", () => {
      const { getByText } = render(
        <StatCard label="Revenue" value="$100" change="+20%" trend="up" />
      );
      expect(getByText("+20%", { exact: false })).toHaveClass("text-green-600");
    });

    it("applies down trend color", () => {
      const { getByText } = render(
        <StatCard label="Churn" value="3.2%" change="+0.4%" trend="down" />
      );
      expect(getByText("+0.4%", { exact: false })).toHaveClass("text-red-500");
    });

    it("applies neutral trend color by default", () => {
      const { getByText } = render(
        <StatCard label="Sessions" value="1,024" change="no change" />
      );
      expect(getByText("no change", { exact: false })).toHaveClass("text-muted-foreground");
    });
  });

  describe("StatCard — icon", () => {
    it("renders icon when provided", () => {
      const { getByTestId } = render(
        <StatCard
          label="Users"
          value="100"
          icon={<span data-testid="test-icon">icon</span>}
        />
      );
      expect(getByTestId("test-icon")).toBeTruthy();
    });

    it("does not render icon slot when icon is omitted", () => {
      const { queryByTestId } = render(
        <StatCard label="Users" value="100" />
      );
      expect(queryByTestId("test-icon")).toBeNull();
    });
  });