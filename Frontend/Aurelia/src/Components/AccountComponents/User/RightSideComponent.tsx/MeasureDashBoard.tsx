import React from "react";
import {
  Ruler,
  ArrowLeftRight,
  Heart,
  ScanLine,
  Sparkles,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Measure } from "../../../../types/type";
import { SegmentMeter } from "../../../UI";

export const MeasureDashBoard: React.FC<{ DataMeasure?: Measure }> = ({
  DataMeasure,
}) => {
  const navigate = useNavigate();

  const bodyMeasurements = [
    {
      name: "Rộng Vai",
      code: "SHD-01",
      value: DataMeasure?.vai,
      max: 60,
      unit: "cm",
      icon: ArrowLeftRight,
      desc: "Khoảng cách giữa hai đầu xương vai",
    },
    {
      name: "Vòng Ngực",
      code: "CHS-02",
      value: DataMeasure?.nguc,
      max: 130,
      unit: "cm",
      icon: Heart,
      desc: "Điểm nở nhất quanh ngực",
    },
    {
      name: "Vòng Eo",
      code: "WST-03",
      value: DataMeasure?.eo,
      max: 110,
      unit: "cm",
      icon: ScanLine,
      desc: "Vòng eo nhỏ nhất tự nhiên",
    },
    {
      name: "Vòng Hông",
      code: "HIP-04",
      value: DataMeasure?.hong,
      max: 130,
      unit: "cm",
      icon: Ruler,
      desc: "Điểm nở nhất của phần hông",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[var(--color-ink)] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]">
            <Ruler size={18} />
          </div>
          <div>
            <h1 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)]">
              Sổ Số Đo May Đo Bespoke
            </h1>
            <p className="mono-label text-[var(--color-ink-muted)]">
              Dữ liệu nhân trắc học dùng để đề xuất kích thước và may đo riêng
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/bodyMeasurements")}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] mono-label font-extrabold self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Cập nhật số đo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bodyMeasurements.map((item) => {
          const Icon = item.icon;
          const hasValue =
            item.value !== undefined &&
            item.value !== null &&
            item.value !== "";
          const numVal = Number(item.value) || 0;

          return (
            <div
              key={item.code}
              className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-5 flex flex-col justify-between min-h-[156px] shadow-[var(--shadow-hard-sm)] space-y-3"
            >
              <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--color-ink)] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-volt)] border border-[var(--color-ink)]" />
                  <span className="mono-label font-extrabold text-[var(--color-ink)]">
                    {item.name}
                  </span>
                </div>
                <div className="w-7 h-7 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-flash)]">
                  <Icon size={14} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-extrabold text-[var(--color-ink)] tabular-nums">
                    {hasValue ? item.value : "—"}
                  </span>
                  <span className="mono-label text-[var(--color-ink-muted)]">
                    {item.unit}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[var(--color-ink-muted)] mt-1">
                  {item.desc}
                </p>
              </div>

              <SegmentMeter
                value={numVal}
                max={item.max}
                segments={12}
                accent={hasValue ? "volt" : "ink"}
                showValue={false}
              />
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--color-bone)] border-2 border-[var(--color-ink)] p-4 flex items-start gap-3">
        <Sparkles size={16} className="text-[var(--color-flash)] shrink-0 mt-0.5" />
        <div className="font-mono text-xs text-[var(--color-ink-muted)] leading-relaxed">
          <strong className="text-[var(--color-ink)] font-extrabold">
            Tự động gợi ý size:
          </strong>{" "}
          Hệ thống của Aurelia sử dụng các thông số trên để tự động so khớp và gợi ý size phù hợp nhất với form dáng của bạn trên từng trang sản phẩm.
        </div>
      </div>
    </div>
  );
};
