import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import type { Appointment } from "../../types/type";
import { useState } from "react";
import { Ticket, Badge } from "../UI";

export default function AppointmentList({
  appointments,
}: {
  appointments: Appointment[] | undefined;
}) {
  const [filter, setFilter] = useState("Tất cả");

  const getBadgeStatus = (
    status: string
  ): "warning" | "info" | "success" | "danger" | "neutral" => {
    switch (status) {
      case "Chờ xác nhận":
        return "warning";
      case "Đã xác nhận":
        return "info";
      case "Hoàn thành":
        return "success";
      case "Đã hủy":
        return "danger";
      default:
        return "neutral";
    }
  };

  const filtered =
    filter === "Tất cả"
      ? appointments
      : appointments?.filter((a) => a.status === filter);

  return (
    <div className="p-4 md:p-6 bg-[var(--color-bone)] min-h-screen space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 p-6 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)]">
        <div>
          <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
            [TICKET BOOTH // APPOINTMENTS]
          </span>
          <h1 className="display-l font-display-safe text-[var(--color-ink)] mt-2">
            Danh sách lịch hẹn
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "Tất cả",
            "Chờ xác nhận",
            "Đã xác nhận",
            "Hoàn thành",
            "Đã hủy",
          ].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`min-h-[44px] px-4 py-2 border-2 border-[var(--color-ink)] mono-label transition-all cursor-pointer ${
                filter === s
                  ? "bg-[var(--color-volt)] text-[var(--color-ink)] font-extrabold shadow-[var(--shadow-hard-sm)]"
                  : "bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-bone)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5">
        {filtered?.map((a) => (
          <Ticket
            key={a.id}
            serial={a.id?.slice(0, 8).toUpperCase()}
            header={a.service}
            stampText={a.status}
            stub={
              <div className="w-full flex flex-col items-end gap-2">
                <Badge status={getBadgeStatus(a.status)}>{a.status}</Badge>
                <div className="text-right font-mono text-xs text-[var(--color-ink)] space-y-1">
                  <p className="font-extrabold flex items-center justify-end gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--color-flash)]" />{" "}
                    {a.customerName}
                  </p>
                  <p className="text-[var(--color-ink-muted)] flex items-center justify-end gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {a.customerEmail}
                  </p>
                  {a.customerPhone && (
                    <p className="text-[var(--color-ink-muted)] flex items-center justify-end gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {a.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            }
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={a.itemImage}
                alt={a.itemName}
                className="w-24 h-24 object-cover border-2 border-[var(--color-ink)] bg-[var(--color-bone)]"
              />
              <div className="space-y-1.5">
                <h2 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)]">
                  {a.itemName}
                </h2>
                <p className="mono-label text-[var(--color-ink-muted)]">
                  {a.service}
                </p>
                <div className="flex items-center gap-3 font-mono text-xs font-bold text-[var(--color-ink)]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[var(--color-flash)]" />{" "}
                    {a.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-flash)]" />{" "}
                    {a.slot}
                  </span>
                </div>
                <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                  Tạo lúc {new Date(a.createdAt).toLocaleString("vi-VN")}
                </p>
                {a.notes && (
                  <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-ink)] bg-[var(--color-bone)] border border-[var(--color-ink)] px-2.5 py-1 mt-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--color-flash)]" />
                    {a.notes}
                  </div>
                )}
              </div>
            </div>
          </Ticket>
        ))}
      </div>
    </div>
  );
}
