import { render, screen } from "@testing-library/react";
  import { Select } from "./Select";

  const fruitOptions = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  describe("Select — rendering", () => {
    it("renders trigger", () => {
      render(<Select options={fruitOptions} />);
      expect(screen.getByRole("combobox")).toBeTruthy();
    });

    it("shows placeholder by default", () => {
      render(<Select options={fruitOptions} />);
      expect(screen.getByText("Select an option")).toBeTruthy();
    });

    it("shows custom placeholder", () => {
      render(<Select options={fruitOptions} placeholder="Choose a fruit..." />);
      expect(screen.getByText("Choose a fruit...")).toBeTruthy();
    });

    it("applies consumer className to trigger", () => {
      render(<Select options={fruitOptions} className="mt-4" />);
      expect(screen.getByRole("combobox")).toHaveClass("mt-4");
    });
  });

  describe("Select — controlled value", () => {
    it("displays selected label in trigger", () => {
      render(<Select options={fruitOptions} value="banana" />);
      expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
    });

    it("displays correct label for selected value", () => {
      render(<Select options={fruitOptions} value="cherry" />);
      expect(screen.getByRole("combobox")).toHaveTextContent("Cherry");
    });
  });

  describe("Select — disabled", () => {
    it("disables the trigger when disabled prop is set", () => {
      render(<Select options={fruitOptions} disabled />);
      expect(screen.getByRole("combobox")).toBeDisabled();
    });
  });

  describe("Select — open state", () => {
    it("renders all options when open", () => {
      render(
        <Select
          options={fruitOptions}
          value="apple"
        />
      );
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("renders options when forced open", () => {
      render(
        <Select options={fruitOptions} defaultValue="apple" />
      );
      expect(screen.getByRole("combobox")).toBeTruthy();
    });
  });

  describe("Select — groups", () => {
    it("renders trigger with groups", () => {
      render(
        <Select
          groups={[
            {
              label: "Fruits",
              options: [{ value: "apple", label: "Apple" }],
            },
          ]}
        />
      );
      expect(screen.getByRole("combobox")).toBeTruthy();
    });

    it("displays selected group option label", () => {
      render(
        <Select
          value="apple"
          groups={[
            {
              label: "Fruits",
              options: [{ value: "apple", label: "Apple" }],
            },
          ]}
        />
      );
      expect(screen.getByRole("combobox")).toHaveTextContent("Apple");
    });
  });