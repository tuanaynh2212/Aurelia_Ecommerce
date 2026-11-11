import { CheckCircle2 } from "lucide-react";
import { DottedLeaderRow, FlipCard, Ticket } from "../UI";

interface BookingPreviewProps {
  showConfirm: boolean;
  shopName?: string;
  address?: string;
  productName?: string;
  service: string;
  selectedDate: string;
  selectedSlot: string;
  duration: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingTicketPreview({
  showConfirm,
  shopName,
  productName,
  service,
  selectedDate,
  selectedSlot,
  duration,
  customerName,
  customerPhone,
  onBack,
  onConfirm,
}: BookingPreviewProps) {
  return (
    <div className="lg:col-span-5 sticky top-20 space-y-4">
      <div className="flex items-center justify-between">
        <span className="mono-label text-[var(--color-ink)]">
          [LIVE ADMISSION TICKET PREVIEW]
        </span>
        <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
          {showConfirm ? "FLIPPED: CONFIRM" : "FRONT SIDE"}
        </span>
      </div>

      <FlipCard
        flipped={showConfirm}
        front={
          <Ticket
            stub={
              <div className="w-full flex items-center justify-between mono-label text-[10px]">
                <span>ADMIT ONE · VIP FITTING</span>
                <span>{duration} MIN</span>
              </div>
            }
          >
            <div className="space-y-2.5">
              <DottedLeaderRow label="DỊCH VỤ" value={service || "CHƯA CHỌN"} />
              <DottedLeaderRow
                label="NGÀY HẸN"
                value={selectedDate || "YYYY-MM-DD"}
              />
              <DottedLeaderRow
                label="KHUNG GIỜ"
                value={selectedSlot || "--:--"}
              />
              <DottedLeaderRow label="KHÁCH HÀNG" value={customerName || "---"} />
              <DottedLeaderRow
                label="SỐ ĐIỆN THOẠI"
                value={customerPhone || "---"}
              />
            </div>
          </Ticket>
        }
        back={
          <Ticket
            stub={
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 min-h-[44px] border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-bone)] mono-label cursor-pointer"
                >
                  QUAY LẠI
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 min-h-[44px] border-2 border-[var(--color-ink)] bg-[var(--color-flash)] text-[var(--color-paper)] mono-label font-extrabold cursor-pointer"
                >
                  HOÀN TẤT
                </button>
              </div>
            }
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--color-success)] mono-label">
                <CheckCircle2 size={14} />
                <span>KIỂM TRA THÔNG TIN VÉ TRƯỚC KHI PHÁT HÀNH</span>
              </div>
              <DottedLeaderRow label="CỬA HÀNG" value={shopName || ""} />
              <DottedLeaderRow
                label="SẢN PHẨM"
                value={productName || "Tư vấn trực tiếp"}
              />
              <DottedLeaderRow label="DỊCH VỤ" value={service} />
              <DottedLeaderRow
                label="THỜI GIAN"
                value={`${selectedDate} · ${selectedSlot}`}
              />
              <DottedLeaderRow
                label="KHÁCH HÀNG"
                value={`${customerName} (${customerPhone})`}
              />
            </div>
          </Ticket>
        }
      />
    </div>
  );
}

export function BookingMobileConfirmModal({
  showConfirm,
  shopName,
  address,
  productName,
  service,
  selectedDate,
  selectedSlot,
  customerName,
  customerPhone,
  customerEmail,
  onBack,
  onConfirm,
}: BookingPreviewProps) {
  if (!showConfirm) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-ink)]/70 z-50 p-4 lg:hidden">
      <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] max-w-lg w-full p-6 space-y-5">
        <div className="border-b-2 border-[var(--color-ink)] pb-3">
          <span className="mono-label text-[var(--color-flash)]">
            [ADMISSION CONFIRMATION]
          </span>
          <h2 className="display-m font-display-safe text-[var(--color-ink)]">
            Xác nhận lịch hẹn
          </h2>
        </div>
        <ul className="space-y-2 text-xs font-mono text-[var(--color-ink)]">
          <li>
            <strong>Cửa hàng:</strong> {shopName}
          </li>
          <li>
            <strong>Địa chỉ:</strong> {address}
          </li>
          <li>
            <strong>Sản phẩm:</strong> {productName}
          </li>
          <li>
            <strong>Dịch vụ:</strong> {service}
          </li>
          <li>
            <strong>Ngày:</strong> {selectedDate}
          </li>
          <li>
            <strong>Giờ:</strong> {selectedSlot}
          </li>
          <li>
            <strong>Khách hàng:</strong> {customerName}
          </li>
          <li>
            <strong>SĐT:</strong> {customerPhone}
          </li>
          {customerEmail && (
            <li>
              <strong>Email:</strong> {customerEmail}
            </li>
          )}
        </ul>

        <div className="flex gap-3 justify-end pt-3 border-t-2 border-[var(--color-ink)]">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] px-5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] mono-label cursor-pointer"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[44px] px-6 border-2 border-[var(--color-ink)] bg-[var(--color-flash)] text-[var(--color-paper)] mono-label font-extrabold cursor-pointer"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
}

