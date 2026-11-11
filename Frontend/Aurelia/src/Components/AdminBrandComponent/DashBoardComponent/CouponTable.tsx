import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Percent,
  Calendar,
} from "lucide-react";
import { Ticket } from "../../UI/primitives/Ticket";
import type { Coupon } from "../../../types/type";

export const CouponTable = ({
  coupon,
  i,
  handleToggleStatus,
  setEditing,
  handleDelete,
}: {
  coupon: Coupon;
  i: number;
  handleToggleStatus: (id: string, status: boolean) => void;
  setEditing: (coupon: Coupon) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <motion.div
      key={coupon.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: i * 0.03 }}
    >
      <Ticket
        stub={
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase text-ink-muted">
              [ADMIT ONE]
            </span>
            <span className="font-display-safe text-xl font-black uppercase text-ink">
              {coupon.loaiGiam === "Phần trăm"
                ? `${coupon.giaTri}%`
                : `${(coupon.giaTri ?? 0).toLocaleString()}đ`}
            </span>
            <span className="px-2 py-0.5 bg-volt border border-ink font-mono text-[10px] font-bold uppercase text-ink">
              SL: {coupon.soLuong}
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-lg font-bold text-ink tracking-wider uppercase">
                  {coupon.code}
                </span>
                {coupon.isActive ? (
                  <CheckCircle size={16} className="text-success" />
                ) : (
                  <XCircle size={16} className="text-ink-muted" />
                )}
              </div>
              <span className="font-mono text-[10px] text-ink-muted block">
                {coupon.id}
              </span>
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleToggleStatus(coupon.id, !coupon.isActive)}
                className={`min-w-[44px] min-h-[44px] p-2 border-2 border-ink flex items-center justify-center transition-colors cursor-pointer ${
                  coupon.isActive
                    ? "bg-volt text-ink"
                    : "bg-bone text-ink-muted hover:bg-paper"
                }`}
                aria-label="Toggle coupon status"
              >
                {coupon.isActive ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setEditing(coupon)}
                className="min-w-[44px] min-h-[44px] p-2 bg-paper border-2 border-ink text-ink hover:bg-volt flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Edit coupon"
              >
                <Edit3 size={16} />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(coupon.id)}
                className="min-w-[44px] min-h-[44px] p-2 bg-paper border-2 border-ink text-danger hover:bg-danger hover:text-paper flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Delete coupon"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-bone border border-ink p-2.5">
              <Calendar size={14} className="text-ink shrink-0" />
              <div>
                <p className="font-mono text-[10px] uppercase text-ink-muted">
                  Bắt đầu
                </p>
                <p className="font-mono text-xs font-bold text-ink">
                  {new Date(coupon.ngayBatDau).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-bone border border-ink p-2.5">
              <Calendar size={14} className="text-ink shrink-0" />
              <div>
                <p className="font-mono text-[10px] uppercase text-ink-muted">
                  Kết thúc
                </p>
                <p className="font-mono text-xs font-bold text-ink">
                  {new Date(coupon.ngayKetThuc).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold uppercase text-ink-muted pt-2 border-t border-dashed border-ink">
            <Percent size={12} className="text-flash" />
            <span>{coupon.loaiGiam}</span>
            <span>•</span>
            <span>{coupon.reuse}</span>
            {coupon.phamViApDung && (
              <>
                <span>•</span>
                <span>{coupon.phamViApDung}</span>
              </>
            )}
          </div>
        </div>
      </Ticket>
    </motion.div>
  );
};
