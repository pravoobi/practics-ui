import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
  } from "./select";

  const BasicSelect = ({ onValueChange }: { onValueChange?: (v: string) => void }) => (
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );

  describe("Select — closed state", () => {
    it("renders trigger", () => {
      render(<BasicSelect />);
      expect(screen.getByRole("combobox")).toBeTruthy();
    });

    it("shows placeholder when no value selected", () => {
      render(<BasicSelect />);
      expect(screen.getByText("Select an option")).toBeTruthy();
    });

    it("does not show options when closed", () => {
      render(<BasicSelect />);
      expect(screen.queryByText("Apple")).toBeNull();
    });
  });

  describe("Select — open state", () => {
    it("shows options when open", () => {
      render(
        <Select open>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByText("Apple")).toBeTruthy();
      expect(screen.getByText("Banana")).toBeTruthy();
      expect(screen.getByText("Cherry")).toBeTruthy();
    });
  });

  describe("Select — selection", () => {
    it("renders items with correct text when open", () => {
      render(
        <Select open>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByText("Apple")).toBeTruthy();
      expect(screen.getByText("Banana")).toBeTruthy();
    });

    it("renders selected value in trigger when value is set", () => {
      render(
        <Select value="banana">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
    });
  });

  describe("Select — with groups", () => {
    it("renders group label when open", () => {
      render(
        <Select open>
          <SelectTrigger>
            <SelectValue placeholder="Pick fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      expect(screen.getByText("Fruits")).toBeTruthy();
    });
  });

  describe("SelectTrigger", () => {
    it("applies base classes", () => {
      render(<BasicSelect />);
      expect(screen.getByRole("combobox")).toHaveClass("w-full");
      expect(screen.getByRole("combobox")).toHaveClass("rounded-md");
    });
  });