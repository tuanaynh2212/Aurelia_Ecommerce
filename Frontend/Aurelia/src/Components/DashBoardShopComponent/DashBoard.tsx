import {
  Calendar,
  ShoppingCart,
  Search,
  Bell,
  TrendingUp,
  Users,
  Clock,
  Inbox,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { Notification } from "./Notification";
import { NotificationContext } from "../../contexts/NotifycationContext";

export function DashBoardShop({
  onclick,
  onChange,
}: {
  onclick: () => void;
  onChange: () => void;
}) {
  const [dataDashBoard, setDataDashBoard] = useState<any>();
  const { GetDataDashBoard, dataDonHang, dataLichHen } =
    useContext(DashBoardShopCOntext);
  const [notifycationOpen, setNotificationOpen] = useState(false);
  useEffect(() => {
    GetDataDashBoard(setDataDashBoard);
  }, []);
  const { message, appointment} = useContext(NotificationContext);

  const stats = [
    {
      title: "Doanh thu hôm nay",
      value: dataDashBoard?.doanhThu.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }) ?? "0",
      change: dataDashBoard?.doanhSoPhanTram ?? "0%",
      icon: TrendingUp,
    },
    {
      title: "Đơn hàng mới",
      value: dataDashBoard?.orderHomNay?? "0",
      change: dataDashBoard?.orderHomNay ?? "0",
      icon: ShoppingCart,
    },
    {
      title: "Lịch hẹn hôm nay",
      value: dataDashBoard?.soLichHen ?? "0",
      change: dataDashBoard?.soLichHen + " đang chờ",
      icon: Calendar,
    },
    {
      title: "Khách hàng mới",
      value: dataDashBoard?.soUser ?? "0",
      change: "+" + (dataDashBoard?.soLuongTang ?? "0") + " tuần này",
      icon: Users,
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <Inbox size={48} className="mb-4" />
      <p>{text}</p>
    </div>
  );

  return (
  <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="serif text-4xl text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Chào mừng trở lại! Đây là tổng quan hôm nay.
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-12 pr-4 py-3 bg-white  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64 shadow-sm"
            />
          </div>
          <button
            onClick={() => setNotificationOpen(!notifycationOpen)}
            className="relative p-3 bg-white  border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Bell size={20} className="text-gray-600" />
            {message && message?.message!==null && appointment?.message !== null && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          {notifycationOpen && <Notification />}
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white  p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12  bg-gradient-to-br bg-black flex items-center justify-center shadow-lg`}
              >
                <stat.icon size={22} className="text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 ">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white  p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg  text-gray-900">
              Đơn hàng gần đây
            </h3>
            <button
              onClick={onclick}
              className="text-sm text-black font-medium"
            >
              Xem tất cả
            </button>
          </div>
          {dataDonHang && dataDonHang.length > 0 ? (
            <div className="space-y-4">
              {dataDonHang.map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <ShoppingCart size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.ngayTaoDon).toLocaleDateString("vi-VN")}{" "}
                        • {order.orderId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 mb-1">
                      {order.address}
                    </p>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Không có đơn hàng nào" />
          )}
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg  text-gray-900">
              Lịch hẹn sắp tới
            </h3>
            <button
              onClick={onChange}
              className="text-sm text-black   font-medium"
            >
              Xem lịch
            </button>
          </div>
          {dataLichHen && dataLichHen.length > 0 ? (
            <div className="space-y-4">
              {dataLichHen.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {appointment.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.service}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span className="font-semibold">
                      {appointment.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Không có lịch hẹn nào" />
          )}
          <button className="w-full mt-4 py-3  text-black border-1 font-medium  hover:shadow-lg transition-all duration-300">
            Thêm lịch hẹn mới
          </button>
        </section>
      </div>
    </main>
  );
}
