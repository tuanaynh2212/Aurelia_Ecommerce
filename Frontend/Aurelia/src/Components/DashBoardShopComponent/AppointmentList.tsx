import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle, Timer, MessageSquare } from "lucide-react";
import type { Appointment } from "../../types/type";
import { useState } from "react";

export default function AppointmentList({
  appointments,
}: {
  appointments: Appointment[] | undefined;
}) {
  const [filter, setFilter] = useState("Tất cả");

  const statusColors: Record<string, string> = {
    "Chờ xác nhận": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "Đã xác nhận": "bg-blue-100 text-blue-700 border-blue-300",
    "Hoàn thành": "bg-green-100 text-green-700 border-green-300",
    "Đã hủy": "bg-red-100 text-red-700 border-red-300",
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Đã xác nhận":
        return <Timer className="w-4 h-4 text-blue-600" />;
      case "Hoàn thành":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Đã hủy":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const filtered = filter === "Tất cả" ? appointments : appointments?.filter((a) => a.status === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-4xl serif  text-gray-800">Danh sách lịch hẹn</h1>
        <div className="flex gap-2">
          {["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Hoàn thành", "Đã hủy"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2  text-sm font-medium shadow-sm transition-all ${
                filter === s
                  ? "bg-black text-white shadow-indigo-200"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5">
        {filtered?.map((a) => (
          <div
            key={a.id}
            className="flex flex-col md:flex-row justify-between gap-5 bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
          >
            <div className="flex gap-4 flex-1">
              <img
                src={a.itemImage}
                alt={a.itemName}
                className="w-24 h-24 object-cover rounded-xl border border-gray-200"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{a.itemName}</h2>
                <p className="text-sm text-gray-500">{a.service}</p>
                <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4" /> {a.date}
                  <Clock className="w-4 h-4 ml-3" /> {a.slot}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Tạo lúc {new Date(a.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${statusColors[a.status]}`}
              >
                {getStatusIcon(a.status)} {a.status}
              </span>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 flex items-center justify-end gap-2">
                  <User className="w-4 h-4 text-gray-500" /> {a.customerName}
                </p>
                <p className="text-sm text-gray-600 flex items-center justify-end gap-2">
                  <Mail className="w-4 h-4 text-gray-500" /> {a.customerEmail}
                </p>
                {a.customerPhone && (
                  <p className="text-sm text-gray-600 flex items-center justify-end gap-2">
                    <Phone className="w-4 h-4 text-gray-500" /> {a.customerPhone}
                  </p>
                )}
              </div>

              {a.notes && (
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-inner">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  {a.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
