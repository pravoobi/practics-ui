 import * as React from "react";
  import type { ColumnDef, SortingState, RowData } from "@tanstack/react-table";

  declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
      hideBelow?: "sm" | "md" | "lg";
    }
  }

  export type { ColumnDef };

  export interface TableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    caption?: string;
    className?: string;
  }

  export interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    caption?: string;
    className?: string;
    defaultSorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
  }