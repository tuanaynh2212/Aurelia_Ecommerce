import React from "react";
import { Scissors, ChevronRight, Calendar, MapPin, Clock } from "lucide-react";
import type { AppointmentCustomer } from "../../../../types/type";
import { Ticket, Badge } from "../../../UI";

const STATUS_MAP: Record<
  string,
  { label: string; status: "success" | "warning" | "danger" | "info" | "neutral" }
> = {
  Confirmed: {
    label: "Đã xác nhận",
    status: "success",
  },
  Pending: {
    label: "Chờ xác nhận",
    status: "warning",
  },
  Cancelled: {
    label: "Đã hủy",
    status: "danger",
  },
};

export const HistoryOrder: React.FC<{
  dataAppointment?: AppointmentCustomer[];
}> = ({ dataAppointment = [] }) => {
  const safeAppointments = Array.isArray(dataAppointment)
    ? dataAppointment
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[var(--color-ink)] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]">
            <Scissors size={18} />
          </div>
          <div>
            <h1 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)]">
              Lịch Hẹn May Đo & Tư Vấn
            </h1>
            <p className="mono-label text-[var(--color-ink-muted)]">
              Theo dõi lịch tư vấn số đo bespoke và may trang phục trực tiếp
            </p>
          </div>
        </div>

        <div className="mono-label text-[var(--color-ink-muted)]">
          Tổng số:{" "}
          <strong className="bg-[var(--color-volt)] text-[var(--color-ink)] px-1.5 py-0.5 font-extrabold">
            {safeAppointments.length}
          </strong>{" "}
          cuộc hẹn
        </div>
      </div>

      <div className="space-y-4">
        {safeAppointments.map((item, idx) => {
          const statusInfo = STATUS_MAP[item.status] || {
            label: item.status || "Đang xử lý",
            status: "neutral" as const,
          };

          return (
            <Ticket
              key={item.id || idx}
              serial={item.id?.slice(0, 8).toUpperCase() || `APT-0${idx + 1}`}
              header={item.shopName || "Aurelia Atelier Flagship"}
              stampText={statusInfo.label}
              stub={
                <div className="w-full flex items-center justify-between gap-3">
                  <Badge status={statusInfo.status}>{statusInfo.label}</Badge>
                  <button
                    type="button"
                    className="min-h-[38px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] inline-flex items-center gap-1 mono-label text-[var(--color-ink)] cursor-pointer"
                  >
                    <span>Chi tiết</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              }
            >
              <div className="font-mono text-xs text-[var(--color-ink-muted)] space-y-1.5">
                <p className="flex items-center gap-2">
                  <Clock size={13} className="text-[var(--color-flash)]" />
                  <span>Dịch vụ:</span>
                  <strong className="text-[var(--color-ink)]">
                    {item.service || "Lấy số đo may đo thủ công"}
                  </strong>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={13} className="text-[var(--color-flash)]" />
                  <span>Thời gian:</span>
                  <span className="text-[var(--color-ink)]">
                    {item.date || "Theo thỏa thuận"}{" "}
                    {item.slot ? `· ${item.slot}` : ""}
                  </span>
                </p>
                {item.Address && (
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-[var(--color-flash)]" />
                    <span>Địa điểm:</span>
                    <span className="text-[var(--color-ink)]">
                      {item.Address}
                    </span>
                  </p>
                )}
              </div>
            </Ticket>
          );
        })}

        {safeAppointments.length === 0 && (
          <div className="bg-[var(--color-bone)] border-2 border-dashed border-[var(--color-ink)] p-12 text-center">
            <div className="w-12 h-12 mx-auto bg-[var(--color-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] mb-3">
              <Calendar size={20} />
            </div>
            <p className="font-display-safe font-extrabold uppercase text-sm text-[var(--color-ink)]">
              Bạn chưa có lịch hẹn may đo nào
            </p>
            <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
              Đặt lịch hẹn với chuyên viên may đo của Aurelia để được tư vấn thiết kế và may đo trực tiếp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
