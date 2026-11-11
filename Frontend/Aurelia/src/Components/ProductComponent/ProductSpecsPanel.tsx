import { useState } from "react";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { cn } from "../../utils/cn";
import { RatingStars, SegmentMeter } from "../UI/primitives/Meter";
import { AccordionItem } from "../UI/primitives/Overlays";
import { ReceiptRow } from "../UI/primitives/Receipt";
import { Ticket } from "../UI/primitives/Ticket";

type SpecTab = "Description" | "Size&Fit" | "Policies";

const TAB_LABELS: Record<SpecTab, string> = {
  Description: "MÔ TẢ THIẾT KẾ",
  "Size&Fit": "THÔNG SỐ KÍCH THƯỚC",
  Policies: "CHÍNH SÁCH ĐỔI TRẢ",
};

const RATING_BUCKETS = [
  { stars: "5★", ratio: 0.85 },
  { stars: "4★", ratio: 0.12 },
  { stars: "3★", ratio: 0.03 },
];

export function ProductDeliveryInfo() {
  return (
    <div className="border-2 border-ink bg-bone p-3.5 rounded-[2px]">
      <ReceiptRow
        label={
          <span className="inline-flex items-center gap-1.5">
            <Truck size={14} /> Vận chuyển
          </span>
        }
        value="GIAO 2-3 NGÀY"
      />
      <ReceiptRow
        label={
          <span className="inline-flex items-center gap-1.5">
            <RotateCcw size={14} /> Đổi trả
          </span>
        }
        value="14 NGÀY MIỄN PHÍ"
      />
      <ReceiptRow
        label={
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} /> Bảo chứng
          </span>
        }
        value="XUẤT XỨ CHÍNH HÃNG"
      />
    </div>
  );
}

export function ProductSpecTabs({ description }: { description?: string }) {
  const [activeTab, setActiveTab] = useState<SpecTab>("Description");

  return (
    <div className="pt-2">
      <div className="mb-3 flex gap-2 border-b-2 border-ink pb-2">
        {(["Description", "Size&Fit", "Policies"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "press-collapse min-h-[40px] border-2 border-ink px-3 py-1 mono-label text-[11px] font-extrabold cursor-pointer rounded-[2px]",
              activeTab === tab
                ? "bg-volt text-ink shadow-hard-sm"
                : "bg-paper text-ink-muted hover:text-ink"
            )}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="min-h-[80px] text-sm leading-relaxed text-ink">
        {activeTab === "Description" && (
          <p>
            {description ||
              "Thiết kế may đo với đường cắt chính xác, tôn dáng tự nhiên và đảm bảo độ bền kết cấu khi sử dụng lâu dài."}
          </p>
        )}
        {activeTab === "Size&Fit" && (
          <div className="space-y-1.5 font-mono text-xs">
            <p>• Phom dáng: Regular Fit chuẩn bảng đo may đo Việt Nam.</p>
            <p>• Chiều cao mẫu tham chiếu: 1m68, cỡ S.</p>
            <p>• Sử dụng công cụ &quot;AI Gợi Ý Size&quot; để tính toán theo số đo cơ thể.</p>
          </div>
        )}
        {activeTab === "Policies" && (
          <div className="space-y-1.5 font-mono text-xs">
            <p>• Miễn phí giao hàng cho đơn từ 500.000 ₫.</p>
            <p>• Đổi kích cỡ trong vòng 14 ngày kể từ khi nhận hàng.</p>
            <p>• Được đồng kiểm số lượng và ngoại quan trước khi thanh toán.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductQualityAndRatings({
  material,
  rating,
}: {
  material?: string;
  rating: number;
}) {
  return (
    <div className="mt-14 grid grid-cols-1 gap-8 border-t-2 border-ink pt-10 lg:grid-cols-12">
      <div className="border-2 border-ink bg-paper p-5 shadow-hard lg:col-span-6 rounded-[2px]">
        <AccordionItem code="01" title="Cấu Trúc Chất Liệu & Bảo Quản" defaultOpen>
          <p className="text-sm text-ink-muted">
            {material
              ? `Thành phần chính: ${material}. Giặt nhẹ ở nhiệt độ thường, phơi nơi thoáng mát.`
              : "Chất liệu tuyển chọn, bề mặt dệt mịn và giữ phom ổn định qua nhiều chu kỳ giặt."}
          </p>
        </AccordionItem>
        <AccordionItem code="02" title="Tiêu Chuẩn Kiểm Định Aurelia Lab">
          <p className="text-sm text-ink-muted">
            Mỗi sản phẩm xuất xưởng đều trải qua kiểm định đường may, độ bền màu và đối chiếu số đo 5 điểm.
          </p>
        </AccordionItem>
      </div>

      <div className="lg:col-span-6">
        <Ticket notchClassName="bg-bone" className="bg-paper">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="mono-label text-[11px] font-extrabold text-ink-muted">
                [RATING HISTOGRAM]
              </span>
              <RatingStars value={rating} showValue />
            </div>
            <div className="space-y-1.5">
              {RATING_BUCKETS.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="mono-label w-8 text-xs font-bold">{row.stars}</span>
                  <SegmentMeter value={row.ratio} segments={10} size="sm" tone="volt" />
                </div>
              ))}
            </div>
          </div>
        </Ticket>
      </div>
    </div>
  );
}

