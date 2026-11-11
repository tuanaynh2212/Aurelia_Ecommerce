import type { ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../../../utils/cn";

export type OrderStatusKind =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipping"
  | "done"
  | "cancelled"
  | "info"
  | "warning";

export interface BadgeProps {
  status?: OrderStatusKind | string;
  children?: ReactNode;
  className?: string;
}

function normalizeStatus(raw: string | undefined): OrderStatusKind {
  const s = (raw || "").toLowerCase();
  if (
    s.includes("cancel") ||
    s.includes("hủy") ||
    s.includes("huỷ") ||
    s.includes("fail") ||
    s.includes("từ chối")
  ) {
    return "cancelled";
  }
  if (
    s.includes("done") ||
    s.includes("hoàn thành") ||
    s.includes("đã giao") ||
    s.includes("thành công") ||
    s.includes("completed") ||
    s.includes("delivered") ||
    s.includes("active")
  ) {
    return "done";
  }
  if (s.includes("ship") || s.includes("đang giao") || s.includes("vận chuyển")) {
    return "shipping";
  }
  if (s.includes("pack") || s.includes("đóng gói") || s.includes("chuẩn bị")) {
    return "packed";
  }
  if (s.includes("confirm") || s.includes("xác nhận") || s.includes("duyệt")) {
    return "confirmed";
  }
  if (s.includes("warn") || s.includes("sắp hết")) {
    return "warning";
  }
  if (s.includes("info")) {
    return "info";
  }
  return "pending";
}

const STATUS_META: Record<
  OrderStatusKind,
  { bg: string; dot: string; Icon: typeof Clock; defaultLabel: string }
> = {
  pending: {
    bg: "bg-bone text-ink",
    dot: "bg-warning",
    Icon: Clock,
    defaultLabel: "CHỜ XỬ LÝ",
  },
  confirmed: {
    bg: "bg-paper text-ink",
    dot: "bg-info",
    Icon: ShieldCheck,
    defaultLabel: "ĐÃ XÁC NHẬN",
  },
  packed: {
    bg: "bg-volt text-ink",
    dot: "bg-ink",
    Icon: Package,
    defaultLabel: "ĐÃ ĐÓNG GÓI",
  },
  shipping: {
    bg: "bg-info text-paper",
    dot: "bg-volt",
    Icon: Truck,
    defaultLabel: "ĐANG GIAO",
  },
  done: {
    bg: "bg-success text-paper",
    dot: "bg-paper",
    Icon: CheckCircle2,
    defaultLabel: "HOÀN THÀNH",
  },
  cancelled: {
    bg: "bg-danger text-paper",
    dot: "bg-paper",
    Icon: XCircle,
    defaultLabel: "ĐÃ HỦY",
  },
  warning: {
    bg: "bg-warning text-ink",
    dot: "bg-ink",
    Icon: AlertTriangle,
    defaultLabel: "CẢNH BÁO",
  },
  info: {
    bg: "bg-paper text-ink",
    dot: "bg-info",
    Icon: Info,
    defaultLabel: "THÔNG TIN",
  },
};

/**
 * Semantic status badge — always paired with BOTH a status dot and a Lucide icon
 * (never color alone) inside a 2px ink border.
 */
export function Badge({ status, children, className }: BadgeProps) {
  const kind = normalizeStatus(status);
  const meta = STATUS_META[kind];
  const Icon = meta.Icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-2 border-ink px-2.5 py-1 mono-label text-[11px] font-bold rounded-[2px]",
        meta.bg,
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full border border-current", meta.dot)} aria-hidden="true" />
      <Icon size={13} strokeWidth={2.5} aria-hidden="true" />
      <span>{children ?? status ?? meta.defaultLabel}</span>
    </span>
  );
}
