import React from "react";
import {
  Heart,
  Move,
  Circle,
  Square,
  RefreshCcw,
  Camera,
  CameraOff,
  Info,
  Ruler,
} from "lucide-react";
import type { Measure } from "../../types/type";
import { SegmentMeter } from "../UI";
import { Canvas } from "@react-three/fiber";
import { StudioLights } from "../UI/three/StudioLights";
import { MannequinRig } from "../UI/three/MannequinRig";

type MeasureItem = {
  label: string;
  code: string;
  value?: string;
  max: number;
  icon: React.ReactNode;
  unit: string;
};

type MeasuresProps = {
  iscameraOn: boolean;
  setDatas: React.Dispatch<React.SetStateAction<boolean>>;
  datas?: Measure;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashBoardMeasures: React.FC<MeasuresProps> = ({
  iscameraOn,
  setIsCameraOn,
  datas,
  setDatas,
}) => {
  const measures: MeasureItem[] = [
    {
      label: "Vai",
      code: "SHD-01",
      value: datas?.vai,
      max: 60,
      icon: <Move className="w-4 h-4 text-[var(--color-flash)]" />,
      unit: "cm",
    },
    {
      label: "Ngực",
      code: "CHS-02",
      value: datas?.nguc,
      max: 130,
      icon: <Heart className="w-4 h-4 text-[var(--color-flash)]" />,
      unit: "cm",
    },
    {
      label: "Eo",
      code: "WST-03",
      value: datas?.eo,
      max: 110,
      icon: <Circle className="w-4 h-4 text-[var(--color-flash)]" />,
      unit: "cm",
    },
    {
      label: "Hông",
      code: "HIP-04",
      value: datas?.hong,
      max: 130,
      icon: <Square className="w-4 h-4 text-[var(--color-flash)]" />,
      unit: "cm",
    },
    {
      label: "Chiều cao",
      code: "HGT-05",
      value: datas?.chieuCao ? String(datas.chieuCao) : undefined,
      max: 200,
      icon: <Ruler className="w-4 h-4 text-[var(--color-flash)]" />,
      unit: "cm",
    },
  ];

  const hasData = measures.some((m) => m.value);

  return (
    <div className="w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] p-6 space-y-5">
      {/* Header + Beside-Camera MannequinRig Preview */}
      <header className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b-2 border-[var(--color-ink)] pb-4">
        <div className="sm:col-span-7 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
              {hasData ? "CALIBRATED" : "AWAITING SCAN"}
            </span>
          </div>
          <h2 className="display-m font-display-safe text-[var(--color-ink)]">
            AI Đo Thông Số Cơ Thể
          </h2>
          <p className="text-xs font-mono text-[var(--color-ink-muted)]">
            {iscameraOn
              ? "Hệ thống đang phân tích tư thế và tỷ lệ cơ thể"
              : "Bật camera để bắt đầu đo"}
          </p>
        </div>

        {/* MannequinRig beside (never over) the camera */}
        <div className="sm:col-span-5 h-40 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] relative overflow-hidden">
          <span className="absolute top-1.5 left-1.5 z-10 mono-label text-[9px] bg-[var(--color-ink)] text-[var(--color-paper)] px-1.5 py-0.5">
            MANNEQUIN RIG
          </span>
          <Canvas camera={{ position: [0, 0.2, 3.8], fov: 42 }}>
            <StudioLights />
            <MannequinRig
              measurements={{
                vai: Number(datas?.vai) || 42,
                nguc: Number(datas?.nguc) || 90,
                eo: Number(datas?.eo) || 72,
                hong: Number(datas?.hong) || 94,
                chieuCao: Number(datas?.chieuCao) || 170,
              }}
              scanning={iscameraOn}
            />
          </Canvas>
        </div>
      </header>

      {/* Instructions Box */}
      <div className="flex gap-3 items-start p-3.5 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] text-xs font-mono text-[var(--color-ink)]">
        <Info className="w-4 h-4 text-[var(--color-flash)] mt-0.5 shrink-0" />
        <div>
          <p className="font-extrabold uppercase">
            Hướng dẫn để đo chính xác nhất
          </p>
          <ul className="mt-1 space-y-0.5 text-[var(--color-ink-muted)]">
            <li>• Đứng cách camera khoảng <b>2 mét</b></li>
            <li>• Đứng thẳng, toàn thân nằm gọn trong khung hình</li>
            <li>• <b>Giơ tay phải ngang đầu</b> để hệ thống bắt đầu đo</li>
          </ul>
        </div>
      </div>

      {/* 5 Metric Rows with Giant Tabular Numerals + 20-segment SegmentMeter */}
      <section className="space-y-3">
        {measures.map((m) => {
          const numVal = Number(m.value) || 0;
          return (
            <div
              key={m.code}
              className="p-3 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {m.icon}
                  <span className="mono-label font-extrabold text-[var(--color-ink)]">
                    {m.label}
                  </span>
                  <span className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                    [{m.code}]
                  </span>
                </div>
                <div className="font-mono font-extrabold text-2xl text-[var(--color-ink)] tabular-nums">
                  {m.value ?? "--"}
                  {m.value && (
                    <span className="text-xs font-mono text-[var(--color-ink-muted)] ml-1">
                      {m.unit}
                    </span>
                  )}
                </div>
              </div>
              <SegmentMeter
                value={numVal}
                max={m.max}
                segments={20}
                accent={numVal > 0 ? "volt" : "ink"}
                showValue={false}
              />
            </div>
          );
        })}
      </section>

      {/* Action Buttons (h-14 Save Button) */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => setIsCameraOn(!iscameraOn)}
          className={`flex-1 h-14 px-5 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] flex items-center justify-center gap-2 mono-label font-extrabold transition-all cursor-pointer ${
            iscameraOn
              ? "bg-[var(--color-danger)] text-[var(--color-paper)]"
              : "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-flash)]"
          }`}
        >
          {iscameraOn ? (
            <CameraOff className="w-4 h-4" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {iscameraOn ? "Tắt camera" : "Bắt đầu đo"}
        </button>

        {hasData && (
          <button
            onClick={() => setDatas(true)}
            className="flex-1 h-14 px-5 border-2 border-[var(--color-ink)] bg-[var(--color-volt)] text-[var(--color-ink)] shadow-[var(--shadow-hard)] hover:bg-[var(--color-flash)] hover:text-[var(--color-paper)] flex items-center justify-center gap-2 mono-label font-extrabold transition-all cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
            Lưu kết quả
          </button>
        )}
      </div>

      {hasData && (
        <p className="mono-label text-[10px] text-[var(--color-ink-muted)] text-center pt-3 border-t-2 border-dashed border-[var(--color-ink)]">
          Sai lệch có thể ±3–5cm tùy ánh sáng, khoảng cách và tư thế đứng
        </p>
      )}
    </div>
  );
};
