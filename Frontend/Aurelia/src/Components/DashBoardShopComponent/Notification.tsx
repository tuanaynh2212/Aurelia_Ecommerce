import { useContext, useState } from "react";
import { NotificationContext } from "../../contexts/NotifycationContext";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { CheckCircle, Bell, Calendar, Package } from "lucide-react";

export const Notification = () => {
  const { message, appointment,handleClickCheck } = useContext(NotificationContext) || {
    message: [],
    appointment: [],
  };
  const { setStatePage } = useContext(DashBoardShopCOntext);
  const [activeTab, setActiveTab] = useState("Đơn Hàng");

  const tabs = [
    { name: "Đơn Hàng", icon: <Package size={16} /> },
    { name: "Lịch Hẹn", icon: <Calendar size={16} /> },
  ];

  const currentList =
    activeTab === "Đơn Hàng" ? message : appointment;
  return (
    <div className="absolute top-24 right-6 w-[400px] bg-gradient-to-br from-rose-500 via-red-500 to-pink-500 text-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Bell size={20} /> Thông báo
        </h1>
        <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
          {currentList.filter((item: any) => item.isChecked !== true).length} mới
        </span>
      </div>

      <div className="flex space-x-2 px-3 py-2 border-b border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`text-xs flex items-center gap-1 rounded-2xl px-4 py-2 font-medium transition-all duration-200
              ${
                activeTab === tab.name
                  ? "bg-white/25 border border-white/40 shadow-sm"
                  : "hover:bg-white/10"
              }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent px-3 py-2 space-y-2">
        {currentList.length > 0 ? (
          currentList.map((msg: any, index: number) => {
            return (
              <div
                key={index}
                className={`px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 hover:shadow-md transition-all duration-200 relative flex items-center group border border-white/10 `}
              >
                <p
                  className={`text-sm leading-snug pr-14 ${
                    msg.isChecked ? "opacity-60 italic" : ""
                  }`}
                >
                  {msg.message}
                </p>
                <button
                  onClick={() => handleClickCheck(msg.id)}
                  className={`absolute top-2 right-2 text-xs flex items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                    msg.isChecked
                      ? "bg-green-500/20 text-green-300 cursor-default"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                  disabled={msg.isCChecked}
                >
                  <CheckCircle size={12} />
                  {msg.isChecked ? "Đã xem" : "Đánh dấu"}
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center text-sm text-white/70 py-6">
            Không có thông báo nào 🎉
          </div>
        )}
      </div>

      <div className="flex justify-between px-4 py-3 border-t border-white/20 bg-white/5">
        <button
          onClick={() =>
            activeTab === "Đơn Hàng"
              ? setStatePage("orders")
              : setStatePage("appointments")
          }
          className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          Xem chi tiết
        </button>
        <button
          className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          Đánh dấu tất cả
        </button>
      </div>
    </div>
  );
};
