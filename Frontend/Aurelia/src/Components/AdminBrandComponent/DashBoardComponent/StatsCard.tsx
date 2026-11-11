import React from "react";
import Icon from "./icon";
import { SplitFlap } from "../../UI/primitives/SplitFlap";

interface StatsCardData {
  icon: React.ReactNode;
  title: string;
  value?: string | number;
  trend?: string;
  isPositive?: boolean;
  color?: string;
  iconBg?: string;
}

const StatsCard = ({ data }: { data: StatsCardData }) => {
  return (
    <div className="bg-paper border-2 border-ink shadow-hard p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4 pb-3 border-b-2 border-ink">
        <div className="w-10 h-10 bg-ink text-paper border-2 border-ink flex items-center justify-center">
          {data.icon}
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-0.5 border border-ink font-mono text-[10px] font-bold uppercase ${
            data.isPositive ? "bg-volt text-ink" : "bg-flash text-paper"
          }`}
        >
          {data.isPositive ? (
            <Icon name="TrendingUp" size={11} />
          ) : (
            <Icon name="TrendingDown" size={11} />
          )}
          {data.trend}
        </div>
      </div>
      <div>
        <p className="font-mono text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-2">
          {data.title}
        </p>
        <div className="my-1 overflow-x-auto">
          <SplitFlap value={String(data.value ?? "0")} size="sm" />
        </div>
        <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider mt-2">
          so với tháng trước
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
