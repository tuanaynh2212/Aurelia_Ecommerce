import { cn } from "../../../utils/cn";

export interface BarcodeProps {
  value?: string;
  height?: number;
  className?: string;
  showLabel?: boolean;
}

/**
 * Industrial CSS barcode strip with optional monospace serial label.
 */
export function Barcode({
  value,
  height = 24,
  className,
  showLabel = false,
}: BarcodeProps) {
  return (
    <div className={cn("inline-flex flex-col gap-1 min-w-[96px]", className)}>
      <div
        aria-hidden="true"
        className="barcode w-full"
        style={{ height: `${height}px` }}
      />
      {showLabel && value && (
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted truncate">
          {value}
        </span>
      )}
    </div>
  );
}

export default Barcode;

