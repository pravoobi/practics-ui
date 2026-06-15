import * as React from "react";
  import {
    Select as SelectPrimitive,
    SelectTrigger as SelectTriggerPrimitive,
    SelectValue,
    SelectContent as SelectContentPrimitive,
    SelectItem as SelectItemPrimitive,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
  } from "@/components/ui/select";
  import { cn } from "@/lib/utils";
  import type {
    SelectProps,
    SelectTriggerProps,
    SelectItemProps,
    SelectContentProps,
  } from "./Select.types";

  const Select = ({
    options = [],
    groups = [],
    value,
    defaultValue,
    onValueChange,
    placeholder = "Select an option",
    disabled,
    className,
  }: SelectProps) => (
    <SelectPrimitive
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <SelectTriggerPrimitive className={cn("w-full", className)} disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTriggerPrimitive>
      <SelectContentPrimitive>
        {options.map((option) => (
          <SelectItemPrimitive
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItemPrimitive>
        ))}
        {groups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((option) => (
              <SelectItemPrimitive
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItemPrimitive>
            ))}
          </SelectGroup>
        ))}
      </SelectContentPrimitive>
    </SelectPrimitive>
  );
  Select.displayName = "Select";

  const SelectTrigger = ({ ref, className, ...props }: SelectTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => (
      <SelectTriggerPrimitive ref={ref} className={className} {...props} />
    );
  SelectTrigger.displayName = "SelectTrigger";

  const SelectItem = ({ ref, className, ...props }: SelectItemProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <SelectItemPrimitive ref={ref} className={className} {...props} />
    );
  SelectItem.displayName = "SelectItem";

  const SelectContent = ({ ref, className, ...props }: SelectContentProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <SelectContentPrimitive ref={ref} className={className} {...props} />
    );
  SelectContent.displayName = "SelectContent";

  export {
    Select,
    SelectTrigger,
    SelectItem,
    SelectContent,
    SelectValue,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
  };