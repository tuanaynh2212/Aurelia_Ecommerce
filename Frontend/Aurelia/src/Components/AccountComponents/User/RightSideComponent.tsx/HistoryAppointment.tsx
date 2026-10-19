import React from "react";
import { Scissors, ChevronRight, Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  Confirmed: {
    label: "Đã xác nhận",
    style: "text-emerald-800 bg-emerald-50 border-emerald-200",
  },
  Pending: {
    label: "Chờ xác nhận",
    style: "text-amber-800 bg-amber-50 border-amber-200",
  },
  Cancelled: {
    label: "Đã hủy",
    style: "text-stone-500 bg-stone-100 border-stone-200",
  },
};

export const HistoryOrder: React.FC<{
  dataAppointment?: any[];
}> = ({ dataAppointment = [] }) => {
  const safeAppointments = Array.isArray(dataAppointment) ? dataAppointment : [];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rule/60 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink">
            <Scissors size={16} />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-ink">
              Lịch Hẹn May Đo & Tư Vấn
            </h1>
            <p className="font-mono text-xs text-ink-muted">
              Theo dõi lịch tư vấn số đo bespoke và may trang phục trực tiếp
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-ink-muted">
          Tổng số: <strong className="text-ink">{safeAppointments.length}</strong> cuộc hẹn
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {safeAppointments.map((item, idx) => {
          const statusInfo = STATUS_MAP[item.status] || {
            label: item.status || "Đang xử lý",
            style: "text-ink-muted bg-paper border-rule",
          };

          return (
            <motion.div
              key={item.id || idx}
              whileHover={{ y: -2 }}
              className="
                bg-paper
                border border-rule/80
                rounded-tag
                p-5 md:p-6
                transition-all
                hover:border-ink/25
                hover:shadow-tag
                shadow-sm
                relative
              "
            >
              {/* Grommet punch */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-hole bg-kraft border border-ink/20 shadow-inner" />
                    <h2 className="font-heading text-base font-semibold text-ink flex items-center gap-2">
                      <Scissors size={15} className="text-cobalt" />
                      {item.shopName || "Aurelia Atelier Flagship"}
                    </h2>
                  </div>

                  <div className="font-mono text-xs text-ink-muted space-y-1.5 pl-5">
                    <p className="flex items-center gap-2">
                      <Clock size={13} className="text-ink-faint" />
                      <span>Dịch vụ:</span>
                      <strong className="text-ink">{item.service || "Lấy số đo may đo thủ công"}</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={13} className="text-ink-faint" />
                      <span>Thời gian:</span>
                      <span className="text-ink">{item.date || "Theo thỏa thuận"}</span>
                    </p>
                    {item.address && (
                      <p className="flex items-center gap-2">
                        <MapPin size={13} className="text-ink-faint" />
                        <span>Địa điểm:</span>
                        <span className="text-ink">{item.address}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right badge */}
                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`
                      font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-tag border
                      ${statusInfo.style}
                    `}
                  >
                    {statusInfo.label}
                  </span>

                  <button
                    className="
                      flex items-center gap-1
                      font-mono text-xs uppercase tracking-wider
                      text-ink-muted
                      hover:text-ink
                      transition-colors
                    "
                  >
                    <span>Chi tiết</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Empty state */}
        {safeAppointments.length === 0 && (
          <div className="bg-paper border border-dashed border-rule rounded-tag p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-tag bg-kraft/15 flex items-center justify-center text-ink-muted mb-3">
              <Calendar size={22} className="text-ink-muted" />
            </div>
            <p className="font-mono text-sm text-ink font-medium">
              Bạn chưa có lịch hẹn may đo nào
            </p>
            <p className="font-mono text-xs text-ink-muted mt-1">
              Đặt lịch hẹn với chuyên viên may đo của Aurelia để được tư vấn thiết kế và may đo trực tiếp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

