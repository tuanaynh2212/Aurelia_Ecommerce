import { useContext, useEffect, useState } from "react";
import {
  Search,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { PopUpDetail } from "./OrderListMiniComponent/PopUpDetail";

export default function OrderListElegant() {
  const { dataDonHang, handleClickUpdateStatus } = useContext(DashBoardShopCOntext);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Xác Nhận":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "Đang giao":
        return <Truck className="w-4 h-4 text-indigo-500" />;
      case "Đã giao":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Đã hủy":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
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

  const buttons = ["Tất cả", "Chờ xác nhận", "Xác Nhận", "Đang giao", "Đã giao", "Đã hủy"];

  const getOrderCount = (status: string) => {
    if (!dataDonHang) return 0;
    if (status === "Tất cả") return dataDonHang.length;
    return dataDonHang.filter((o) => o.status === status).length;
  };

  return (
    <>
      {PopUpDetailOpen && (
        <div className="inset-0 fixed z-50 w-full h-screen flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <PopUpDetail
            data={dataDonHang}
            onClose={() => setPopUpDetailOpen(false)}
            orderId={orderId}
          />
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl serif text-black   ">
                Quản lý đơn hàng
              </h1>
            </div>
            <p className="text-gray-600 text-sm ">
              Theo dõi và quản lý tất cả đơn hàng của bạn
            </p>
          </div>

          <div className="mb-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã đơn hàng..."
                className="w-full bg-white/80 backdrop-blur-sm border border-gray-200  pl-12 pr-4 py-3.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm hover:shadow-md transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                className={`group relative px-4 py-2.5  text-sm font-medium transition-all duration-200 ${
                  filter === btn
                    ? "bg-black text-white shadow-lg shadow-indigo-200 scale-105"
                    : "bg-white/70 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  {btn}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      filter === btn
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 "
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
                icon={<Package className="w-10 h-10 text-gray-400" />}
                title="Chưa có đơn hàng"
                subtitle="Các đơn hàng mới sẽ xuất hiện tại đây"
              />
            ) : filteredOrders.length === 0 ? (
              <EmptyState
                icon={<Search className="w-10 h-10 text-gray-400" />}
                title="Không tìm thấy đơn hàng"
                subtitle="Thử tìm kiếm với từ khóa khác"
              />
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            Mã đơn hàng
                          </span>
                          <span className="px-3 py-1 bg-gray-50 rounded-lg text-sm font-mono font-semibold text-gray-800 border">
                            #{order.orderId}
                          </span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <InfoCard
                          icon={<User className="w-5 h-5 text-indigo-600" />}
                          label="Khách hàng"
                          value={order.name}
                        />
                        <InfoCard
                          icon={<MapPin className="w-5 h-5 text-blue-600" />}
                          label="Địa chỉ"
                          value={order.address}
                          small
                        />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.ngayTaoDon).toLocaleString("vi-VN")}</span>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-3 lg:items-end">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border shadow-sm ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>

                      <button
                        className="flex items-center justify-center gap-2 px-6 py-2.5  bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 hover:-translate-y-0.5"
                        onClick={() => {
                          setPopUpDetailOpen(true);
                          setOrderId(order.orderId);
                        }}
                      >
                        <Package className="w-4 h-4" />
                        <span>Chi tiết</span>
                      </button>

                      <button
                        className="flex items-center justify-center gap-2 px-6 py-2.5  bg-white text-gray-700 font-medium border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                        onClick={() =>
                          handleClickUpdateStatus(getNextStatus(order.status), order.orderId)
                        }
                      >
                        <Truck className="w-4 h-4 text-indigo-600/70" />
                        <span>{getNextStatus(order.status)}</span>
                      </button>
                    </div>
                  </div>
                </div>
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
      <div className="w-10 h-10  bg-indigo-50 flex items-center justify-center flex-shrink-0 transition-colors">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p
          className={`${
            small ? "text-sm text-gray-700 line-clamp-2" : "text-base font-semibold text-gray-900"
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
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
      <div className="w-20 h-20 mx-auto mb-4  bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Chờ xác nhận":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Xác Nhận":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Đang giao":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "Đã giao":
      return "bg-green-50 text-green-700 border-green-200";
    case "Đã hủy":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}
