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
} from "lucide-react";
import type { Measure } from "../../types/type";

type MeasureItem = {
  label: string;
  value?: string;
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
    { label: "Vai", value: datas?.vai, icon: <Move className="w-5 h-5 text-blue-600" />, unit: "cm" },
    { label: "Ngực", value: datas?.nguc, icon: <Heart className="w-5 h-5 text-pink-600" />, unit: "cm" },
    { label: "Eo", value: datas?.eo, icon: <Circle className="w-5 h-5 text-green-600" />, unit: "cm" },
    { label: "Hông", value: datas?.hong, icon: <Square className="w-5 h-5 text-purple-600" />, unit: "cm" },
  ];

  const hasData = measures.some((m) => m.value);

  const MeasureCard = ({ label, value, icon, unit }: MeasureItem) => (
    <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center">
      <div className="p-3 rounded-xl bg-gray-50 shadow mb-2">{icon}</div>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="mt-1 text-xl font-bold text-gray-900">
        {value ?? "--"}
        {value && <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center w-full md:w-auto md:h-[840px] px-2 md:px-0">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_20px_60px_rgba(59,130,246,0.25)] p-6 md:space-y-6 space-y-2">

        <header className="flex flex-col items-center text-center space-y-3">
          <div
            className={`relative w-18 h-18 flex items-center justify-center rounded-2xl shadow-xl
              ${iscameraOn ? "bg-gradient-to-br from-green-500 to-emerald-600 animate-pulse"
                : "bg-gradient-to-br from-gray-400 to-gray-600"}`}
          >
            {iscameraOn ? <Camera className="w-8 h-8 text-white" /> : <CameraOff className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">AI Đo Thông Số Cơ Thể</h2>
          <p className="text-sm md:text-base text-gray-500">
            {iscameraOn
              ? "Hệ thống đang phân tích tư thế và tỷ lệ cơ thể"
              : "Bật camera để bắt đầu đo"}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium
              ${hasData ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
          >
            {hasData ? "Kết quả đo gần nhất" : "Chưa có dữ liệu đo"}
          </span>
        </header>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 text-sm md:text-base text-gray-700">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800">Hướng dẫn để đo chính xác nhất</p>
            <ul className="mt-1 space-y-1 text-gray-600">
              <li>• Đứng cách camera khoảng <b>2 mét</b></li>
              <li>• Đứng thẳng, toàn thân nằm gọn trong khung hình</li>
              <li>• <b>Giơ tay phải ngang đầu</b> để hệ thống bắt đầu đo</li>
            </ul>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {measures.map((m, i) => <MeasureCard key={i} {...m} />)}
        </section>

        <div className="flex flex-col md:flex-row gap-3 pt-2">
          <button
            onClick={() => setIsCameraOn(!iscameraOn)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-white shadow-lg transition
              ${iscameraOn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700"}`}
          >
            {iscameraOn ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            {iscameraOn ? "Tắt camera" : "Bắt đầu đo"}
          </button>

          {hasData && (
            <button
              onClick={() => setDatas(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-semibold"
            >
              <RefreshCcw className="w-5 h-5" />
              Lưu kết quả
            </button>
          )}
        </div>

        {hasData && (
          <p className="text-xs text-gray-500 text-center pt-3 border-t border-dashed border-gray-200">
            Sai lệch có thể ±3–5cm tùy ánh sáng, khoảng cách và tư thế đứng
          </p>
        )}
      </div>
    </div>
  );
};
