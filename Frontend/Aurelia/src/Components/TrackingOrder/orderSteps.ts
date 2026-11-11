import {
  Calendar,
  CheckCircle,
  Home,
  Package2Icon,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { order } from "../../types/type";

export type OrderStepKey =
  | "Chờ Xác Nhận"
  | "Xác Nhận"
  | "Đóng Gói"
  | "Đang giao"
  | "Đã Giao";

export interface OrderStepItem {
  status: OrderStepKey;
  date: string | undefined;
}

const ORDER_STATUS_INDEX: Record<string, number> = {
  "Chờ Xác Nhận": 0,
  "Xác Nhận": 1,
  "Đóng Gói": 2,
  "Đang giao": 3,
  "Đã Giao": 4,
};

export const ORDER_STEP_ICONS: Record<OrderStepKey, LucideIcon> = {
  "Chờ Xác Nhận": Calendar,
  "Xác Nhận": CheckCircle,
  "Đóng Gói": Package2Icon,
  "Đang giao": Truck,
  "Đã Giao": Home,
};

export function getOrderStatusIndex(status: string | undefined): number {
  return ORDER_STATUS_INDEX[status ?? ""] ?? 0;
}

export function buildOrderSteps(data: order | undefined): OrderStepItem[] {
  const updateTime = data?.tracking?.updateTime;
  return [
    { status: "Chờ Xác Nhận", date: data?.ngayTaoDon },
    { status: "Xác Nhận", date: updateTime },
    { status: "Đóng Gói", date: updateTime },
    { status: "Đang giao", date: updateTime },
    { status: "Đã Giao", date: updateTime },
  ];
}

