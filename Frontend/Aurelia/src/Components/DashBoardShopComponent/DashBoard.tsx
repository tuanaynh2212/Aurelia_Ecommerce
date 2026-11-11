import {
  Calendar,
  ShoppingCart,
  Search,
  Bell,
  TrendingUp,
  Users,
  Clock,
  Inbox,
  ArrowUpRight,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { Notification } from "./Notification";
import { NotificationContext } from "../../contexts/NotifycationContext";
import { SplitFlap, Badge } from "../UI";

interface ShopDashboardMetrics {
  doanhThu?: number;
  doanhSoPhanTram?: string;
  orderHomNay?: number | string;
  soLichHen?: number | string;
  soUser?: number | string;
  soLuongTang?: number | string;
}

export function DashBoardShop({
  onclick,
  onChange,
}: {
  onclick: () => void;
  onChange: () => void;
}) {
  const [dataDashBoard, setDataDashBoard] = useState<ShopDashboardMetrics>();
  const { GetDataDashBoard, dataDonHang, dataLichHen } =
    useContext(DashBoardShopCOntext);
  const [notifycationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    GetDataDashBoard(setDataDashBoard);
  }, [GetDataDashBoard]);

  const { message, appointment } = useContext(NotificationContext);

  const stats = [
    {
      title: "Doanh thu hôm nay",
      code: "KPI-REV",
      value:
        dataDashBoard?.doanhThu?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) ?? "0 ₫",
      change: dataDashBoard?.doanhSoPhanTram ?? "0%",
      icon: TrendingUp,
    },
    {
      title: "Đơn hàng mới",
      code: "KPI-ORD",
      value: String(dataDashBoard?.orderHomNay ?? "0"),
      change: `${dataDashBoard?.orderHomNay ?? "0"} ĐƠN`,
      icon: ShoppingCart,
    },
    {
      title: "Lịch hẹn hôm nay",
      code: "KPI-APT",
      value: String(dataDashBoard?.soLichHen ?? "0"),
      change: `${dataDashBoard?.soLichHen ?? 0} ĐANG CHỜ`,
      icon: Calendar,
    },
    {
      title: "Khách hàng mới",
      code: "KPI-USR",
      value: String(dataDashBoard?.soUser ?? "0"),
      change: `+${dataDashBoard?.soLuongTang ?? "0"} TUẦN NÀY`,
      icon: Users,
    },
  ];

  const getStatusBadge = (
    status: string
  ): "success" | "info" | "danger" | "warning" => {
    switch (status) {
      case "completed":
      case "Đã giao":
        return "success";
      case "processing":
      case "Đang giao":
        return "info";
      case "cancelled":
      case "Đã hủy":
        return "danger";
      default:
        return "warning";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const EmptyState = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-[var(--color-ink-muted)] border-2 border-dashed border-[var(--color-ink)] bg-[var(--color-bone)]">
      <Inbox size={36} className="mb-3" />
      <p className="mono-label">{text}</p>
    </div>
  );

  return (
    <main className="flex-1 bg-[var(--color-bone)] p-2 md:p-4 space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] relative">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
              [CONTROL ROOM // SHOP OPS]
            </span>
          </div>
          <h1 className="display-l font-display-safe text-[var(--color-ink)]">
            Dashboard
          </h1>
          <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
            Chào mừng trở lại! Đây là tổng quan hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="min-h-[44px] pl-10 pr-4 py-2 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] font-mono text-xs focus:outline-none focus:bg-[var(--color-paper)] w-full md:w-64"
            />
          </div>
          <button
            onClick={() => setNotificationOpen(!notifycationOpen)}
            className="relative min-w-[44px] min-h-[44px] inline-flex items-center justify-center bg-[var(--color-paper)] border-2 border-[var(--color-ink)] hover:bg-[var(--color-volt)] shadow-[var(--shadow-hard-sm)] transition-colors cursor-pointer"
          >
            <Bell size={18} className="text-[var(--color-ink)]" />
            {message &&
              message?.message !== null &&
              appointment?.message !== null && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--color-flash)] rounded-full border border-[var(--color-ink)]" />
              )}
          </button>
          {notifycationOpen && <Notification />}
        </div>
      </header>

      {/* Scoreboard KPI Cards with SplitFlap Counters */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.code}
            className="bg-[var(--color-paper)] p-5 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between border-b-2 border-dashed border-[var(--color-ink)] pb-3">
              <div className="w-10 h-10 bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center">
                <stat.icon size={18} />
              </div>
              <span className="px-2 py-0.5 bg-[var(--color-volt)] border border-[var(--color-ink)] mono-label font-extrabold text-[10px] text-[var(--color-ink)]">
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="mono-label text-[var(--color-ink-muted)] mb-2">
                {stat.title}
              </h3>
              <SplitFlap value={stat.value} size="sm" />
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-[var(--color-paper)] p-6 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-[var(--color-ink)]">
            <h3 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)]">
              Đơn hàng gần đây
            </h3>
            <button
              onClick={onclick}
              className="min-h-[36px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-volt)] mono-label font-extrabold flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
          {dataDonHang && dataDonHang.length > 0 ? (
            <div className="space-y-3">
              {dataDonHang.slice(0, 6).map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between p-3.5 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-paper)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center">
                      <ShoppingCart
                        size={16}
                        className="text-[var(--color-flash)]"
                      />
                    </div>
                    <div>
                      <p className="font-mono font-extrabold text-xs text-[var(--color-ink)]">
                        {order.name}
                      </p>
                      <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                        {new Date(order.ngayTaoDon).toLocaleDateString("vi-VN")}{" "}
                        · {order.orderId.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-mono text-xs font-bold text-[var(--color-ink)] truncate max-w-[160px]">
                      {order.address}
                    </p>
                    <Badge status={getStatusBadge(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Không có đơn hàng nào" />
          )}
        </section>

        <section className="bg-[var(--color-paper)] p-6 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-[var(--color-ink)]">
              <h3 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)]">
                Lịch hẹn sắp tới
              </h3>
              <button
                onClick={onChange}
                className="min-h-[36px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-volt)] mono-label font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <span>Xem lịch</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
            {dataLichHen && dataLichHen.length > 0 ? (
              <div className="space-y-3">
                {dataLichHen.slice(0, 6).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3.5 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-paper)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center">
                        <Calendar
                          size={16}
                          className="text-[var(--color-ink)]"
                        />
                      </div>
                      <div>
                        <p className="font-mono font-extrabold text-xs text-[var(--color-ink)]">
                          {apt.customerName}
                        </p>
                        <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                          {apt.service}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 border border-[var(--color-ink)] bg-[var(--color-paper)] mono-label text-[10px] text-[var(--color-ink)]">
                      <Clock size={12} className="text-[var(--color-flash)]" />
                      <span>{apt.duration} MIN</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Không có lịch hẹn nào" />
            )}
          </div>

          <button
            onClick={onChange}
            className="w-full min-h-[48px] mt-5 py-3 bg-[var(--color-ink)] hover:bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] mono-label font-extrabold transition-colors cursor-pointer"
          >
            Thêm lịch hẹn mới
          </button>
        </section>
      </div>
    </main>
  );
}
