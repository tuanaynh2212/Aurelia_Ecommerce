import { useContext, useEffect, useState } from "react";
import {
  Search,
  Truck,
  Package,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { PopUpDetail } from "./OrderListMiniComponent/PopUpDetail";
import { Ticket, Badge } from "../UI";

export default function OrderListElegant() {
  const { dataDonHang, handleClickUpdateStatus } =
    useContext(DashBoardShopCOntext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [filteredOrders, setFilteredOrders] = useState(dataDonHang || []);
  const [PopUpDetailOpen, setPopUpDetailOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setFilteredOrders(dataDonHang || []);
  }, [dataDonHang]);

  useEffect(() => {
    if (!dataDonHang) return;

    const filtered = dataDonHang.filter((order) => {
      const matchSearch =
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        filter === "Tất cả" ||
        order.status.toLowerCase().includes(filter.toLowerCase());

      return matchSearch && matchStatus;
    });

    setFilteredOrders(filtered);
  }, [searchTerm, filter, dataDonHang]);

  const getBadgeStatus = (
    status: string
  ): "warning" | "info" | "success" | "danger" | "neutral" => {
    switch (status) {
      case "Chờ xác nhận":
        return "warning";
      case "Xác Nhận":
      case "Đang giao":
        return "info";
      case "Đã giao":
        return "success";
      case "Đã hủy":
        return "danger";
      default:
        return "neutral";
    }
  };

  const getNextStatus = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "Xác Nhận";
      case "Xác Nhận":
        return "Đóng Gói";
      case "Đóng Gói":
        return "Đang giao";
      case "Đang giao":
        return "Đã giao";
      default:
        return "Chờ xác nhận";
    }
  };

  const buttons = [
    "Tất cả",
    "Chờ xác nhận",
    "Xác Nhận",
    "Đang giao",
    "Đã giao",
    "Đã hủy",
  ];

  const getOrderCount = (status: string) => {
    if (!dataDonHang) return 0;
    if (status === "Tất cả") return dataDonHang.length;
    return dataDonHang.filter((o) => o.status === status).length;
  };

  return (
    <>
      {PopUpDetailOpen && (
        <div className="inset-0 fixed z-50 w-full h-screen flex items-center justify-center bg-[var(--color-ink)]/70">
          <PopUpDetail
            data={dataDonHang}
            onClose={() => setPopUpDetailOpen(false)}
            orderId={orderId}
          />
        </div>
      )}

      <div className="min-h-screen bg-[var(--color-bone)] p-4 sm:p-6 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="p-6 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)]">
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
              [CONTROL ROOM // ORDER LOGISTICS]
            </span>
            <h1 className="display-l font-display-safe text-[var(--color-ink)] mt-2">
              Quản lý đơn hàng
            </h1>
            <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
              Theo dõi và quản lý tất cả đơn hàng của bạn
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã đơn hàng..."
              className="w-full min-h-[48px] bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] pl-12 pr-4 py-3 font-mono text-xs text-[var(--color-ink)] focus:outline-none focus:bg-[var(--color-volt)]/15"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                className={`min-h-[44px] px-4 py-2 border-2 border-[var(--color-ink)] mono-label transition-all cursor-pointer ${
                  filter === btn
                    ? "bg-[var(--color-volt)] text-[var(--color-ink)] font-extrabold shadow-[var(--shadow-hard-sm)]"
                    : "bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-bone)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {btn}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 border border-[var(--color-ink)] ${
                      filter === btn
                        ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                        : "bg-[var(--color-bone)] text-[var(--color-ink)]"
                    }`}
                  >
                    {getOrderCount(btn)}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {dataDonHang?.length === 0 ? (
              <EmptyState
                icon={<Package className="w-8 h-8 text-[var(--color-ink)]" />}
                title="Chưa có đơn hàng"
                subtitle="Các đơn hàng mới sẽ xuất hiện tại đây"
              />
            ) : filteredOrders.length === 0 ? (
              <EmptyState
                icon={<Search className="w-8 h-8 text-[var(--color-ink)]" />}
                title="Không tìm thấy đơn hàng"
                subtitle="Thử tìm kiếm với từ khóa khác"
              />
            ) : (
              filteredOrders.map((order) => (
                <Ticket
                  key={order.orderId}
                  serial={order.orderId.slice(0, 8).toUpperCase()}
                  header={`MÃ ĐƠN · #${order.orderId.slice(0, 8)}`}
                  stampText={order.status}
                  stub={
                    <div className="flex flex-wrap lg:flex-col gap-2.5 lg:items-end w-full">
                      <Badge status={getBadgeStatus(order.status)}>
                        {order.status}
                      </Badge>

                      <button
                        className="min-h-[42px] flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-ink)] hover:bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] mono-label font-extrabold transition-colors cursor-pointer"
                        onClick={() => {
                          setPopUpDetailOpen(true);
                          setOrderId(order.orderId);
                        }}
                      >
                        <Package className="w-4 h-4" />
                        <span>Chi tiết</span>
                      </button>

                      <button
                        className="min-h-[42px] flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-volt)] hover:bg-[var(--color-flash)] hover:text-[var(--color-paper)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] mono-label font-extrabold transition-colors cursor-pointer"
                        onClick={() =>
                          handleClickUpdateStatus(
                            getNextStatus(order.status),
                            order.orderId
                          )
                        }
                      >
                        <Truck className="w-4 h-4" />
                        <span>{getNextStatus(order.status)}</span>
                      </button>
                    </div>
                  }
                >
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <InfoCard
                        icon={
                          <User className="w-4 h-4 text-[var(--color-flash)]" />
                        }
                        label="Khách hàng"
                        value={order.name}
                      />
                      <InfoCard
                        icon={
                          <MapPin className="w-4 h-4 text-[var(--color-flash)]" />
                        }
                        label="Địa chỉ"
                        value={order.address}
                        small
                      />
                    </div>

                    <div className="flex items-center gap-2 mono-label text-[10px] text-[var(--color-ink-muted)] pt-2 border-t-2 border-dashed border-[var(--color-ink)]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(order.ngayTaoDon).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </Ticket>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
          {label}
        </p>
        <p
          className={`font-mono text-xs text-[var(--color-ink)] ${
            small ? "line-clamp-2" : "font-extrabold"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-[var(--color-paper)] border-2 border-dashed border-[var(--color-ink)] p-14 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)] mb-1">
        {title}
      </h3>
      <p className="font-mono text-xs text-[var(--color-ink-muted)]">
        {subtitle}
      </p>
    </div>
  );
}
