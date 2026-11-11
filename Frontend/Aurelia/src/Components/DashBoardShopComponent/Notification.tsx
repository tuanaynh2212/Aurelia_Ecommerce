import { useContext, useState } from "react";
import { NotificationContext } from "../../contexts/NotifycationContext";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { CheckCircle, Bell, Calendar, Package } from "lucide-react";

interface NotificationMessage {
  id: string;
  message: string;
  isChecked?: boolean;
  isCChecked?: boolean;
}

export const Notification = () => {
  const { message, appointment, handleClickCheck } = useContext(
    NotificationContext
  ) || {
    message: [],
    appointment: [],
  };
  const { setStatePage } = useContext(DashBoardShopCOntext);
  const [activeTab, setActiveTab] = useState("Đơn Hàng");

  const tabs = [
    { name: "Đơn Hàng", icon: <Package size={15} /> },
    { name: "Lịch Hẹn", icon: <Calendar size={15} /> },
  ];

  const currentList: NotificationMessage[] =
    activeTab === "Đơn Hàng" ? message : appointment;

  return (
    <div className="absolute top-20 right-4 z-50 w-[380px] max-w-[92vw] bg-[var(--color-paper)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]">
        <h1 className="mono-label font-extrabold flex items-center gap-2">
          <Bell size={16} className="text-[var(--color-volt)]" /> Thông báo
        </h1>
        <span className="px-2 py-0.5 bg-[var(--color-volt)] text-[var(--color-ink)] mono-label font-extrabold text-[10px]">
          {currentList.filter((item) => item.isChecked !== true).length} mới
        </span>
      </div>

      <div className="grid grid-cols-2 border-b-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`min-h-[42px] flex items-center justify-center gap-1.5 mono-label transition-colors cursor-pointer ${
              activeTab === tab.name
                ? "bg-[var(--color-volt)] text-[var(--color-ink)] font-extrabold"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      <div className="max-h-64 overflow-y-auto p-3 space-y-2 bg-[var(--color-paper)]">
        {currentList.length > 0 ? (
          currentList.map((msg, index) => (
            <div
              key={msg.id || index}
              className="p-3 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] relative flex items-center justify-between gap-2"
            >
              <p
                className={`font-mono text-xs leading-snug flex-1 ${
                  msg.isChecked ? "opacity-50" : "font-bold"
                }`}
              >
                {msg.message}
              </p>
              <button
                onClick={() => handleClickCheck(msg.id)}
                className={`min-h-[32px] px-2.5 py-1 border border-[var(--color-ink)] mono-label text-[10px] flex items-center gap-1 shrink-0 cursor-pointer ${
                  msg.isChecked
                    ? "bg-[var(--color-fog)] text-[var(--color-ink-muted)] cursor-default"
                    : "bg-[var(--color-volt)] text-[var(--color-ink)] font-extrabold"
                }`}
                disabled={msg.isCChecked}
              >
                <CheckCircle size={11} />
                {msg.isChecked ? "Đã xem" : "Đánh dấu"}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center mono-label text-[var(--color-ink-muted)] py-8">
            Không có thông báo nào
          </div>
        )}
      </div>

      <div className="flex justify-between px-4 py-3 border-t-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
        <button
          onClick={() =>
            activeTab === "Đơn Hàng"
              ? setStatePage("orders")
              : setStatePage("appointments")
          }
          className="min-h-[36px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] mono-label font-extrabold cursor-pointer"
        >
          Xem chi tiết
        </button>
        <button className="min-h-[36px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] mono-label font-extrabold cursor-pointer">
          Đánh dấu tất cả
        </button>
      </div>
    </div>
  );
};
