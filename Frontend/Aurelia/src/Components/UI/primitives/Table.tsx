import type { ReactNode, TableHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";
import { tableCellClass, tableHeadCellClass } from "./recipes";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  wrapperClassName?: string;
}

/**
 * Sticky-header industrial zebra table with horizontal scroll wrapper.
 */
export function Table({ children, className, wrapperClassName, ...rest }: TableProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto border-2 border-ink bg-paper shadow-hard rounded-[2px]",
        wrapperClassName
      )}
    >
      <table
        className={cn("w-full border-collapse text-left text-sm", className)}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

export function THead({ children, className }: { children: ReactNode; className?: string }) {
  return <thead className={cn("border-b-2 border-ink bg-ink text-paper", className)}>{children}</thead>;
}

export function TBody({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={cn("divide-y-2 divide-ink/15 [&>tr:nth-child(even)]:bg-bone/45", className)}>{children}</tbody>;
}

export function TH({
  children,
  className,
  align = "left",
}: {
  children?: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <th
      scope="col"
      className={cn(
        tableHeadCellClass,
        align === "right" && "text-right",
        align === "center" && "text-center",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TD({
  children,
  className,
  align = "left",
  colSpan,
}: {
  children?: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        tableCellClass,
        align === "right" && "text-right",
        align === "center" && "text-center",
        className
      )}
    >
      {children}
    </td>
  );
}
