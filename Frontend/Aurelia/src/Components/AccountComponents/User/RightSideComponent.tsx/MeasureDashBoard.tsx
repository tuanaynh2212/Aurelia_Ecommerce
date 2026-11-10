import React from "react";
import { Ruler, ArrowLeftRight, Heart, ScanLine, Sparkles, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const MeasureDashBoard: React.FC<{ DataMeasure: any }> = ({ DataMeasure }) => {
  const navigate = useNavigate();

  const bodyMeasurements = [
    {
      name: "Rộng Vai",
      value: DataMeasure?.vai,
      unit: "cm",
      icon: ArrowLeftRight,
      desc: "Khoảng cách giữa hai đầu xương vai",
    },
    {
      name: "Vòng Ngực",
      value: DataMeasure?.nguc,
      unit: "cm",
      icon: Heart,
      desc: "Điểm nở nhất quanh ngực",
    },
    {
      name: "Vòng Eo",
      value: DataMeasure?.eo,
      unit: "cm",
      icon: ScanLine,
      desc: "Vòng eo nhỏ nhất tự nhiên",
    },
    {
      name: "Vòng Hông",
      value: DataMeasure?.hong,
      unit: "cm",
      icon: Ruler,
      desc: "Điểm nở nhất của phần hông",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rule/60 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink">
            <Ruler size={16} />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-ink">
              Sổ Số Đo May Đo Bespoke
            </h1>
            <p className="font-mono text-xs text-ink-muted">
              Dữ liệu nhân trắc học dùng để đề xuất kích thước và may đo riêng
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/bodyMeasurements")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-tag bg-cobalt hover:bg-cobalt-hover text-white font-mono text-xs uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Cập nhật số đo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bodyMeasurements.map((item, index) => {
          const Icon = item.icon;
          const hasValue = item.value !== undefined && item.value !== null && item.value !== "";

          return (
            <motion.div
              key={index}
              whileHover={{ y: -2 }}
              className="
                bg-paper
                border border-rule/80
                rounded-tag
                p-5
                flex flex-col justify-between
                min-h-[140px]
                transition-all
                hover:border-ink/30
                hover:shadow-tag
                shadow-sm
                relative
              "
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-hole bg-kraft/70 border border-ink/20" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                    {item.name}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink-muted">
                  <Icon size={14} />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-semibold text-ink">
                    {hasValue ? item.value : "—"}
                  </span>
                  <span className="font-mono text-xs text-ink-muted font-medium">
                    {item.unit}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-ink-faint mt-1">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-kraft/15 border border-kraft-dark/30 rounded-tag p-4 flex items-start gap-3">
        <Sparkles size={16} className="text-cobalt shrink-0 mt-0.5" />
        <div className="font-mono text-xs text-ink-muted leading-relaxed">
          <strong className="text-ink font-semibold">Tự động gợi ý size:</strong> Hệ thống của Aurelia sử dụng các thông số trên để tự động so khớp và gợi ý size phù hợp nhất với form dáng của bạn trên từng trang sản phẩm.
        </div>
      </div>
    </div>
  );
};

