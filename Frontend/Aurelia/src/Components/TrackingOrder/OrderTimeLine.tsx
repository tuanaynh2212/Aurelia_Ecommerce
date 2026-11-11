import React, { useMemo } from "react";
import type { order } from "../../types/type";
import { formatDateTime } from "../../utils/formatters";
import {
  buildOrderSteps,
  getOrderStatusIndex,
  ORDER_STEP_ICONS,
} from "./orderSteps";

interface OrderTimelineProps {
  data: order | undefined;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ data }) => {
  const steps = buildOrderSteps(data);
  const statusIndex = useMemo(
    () => getOrderStatusIndex(data?.status),
    [data?.status]
  );
  const progressPercentage = (statusIndex / (steps.length - 1)) * 100;

  return (
    <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 w-full overflow-x-auto">
      <div className="min-w-[640px] flex items-center justify-between relative px-6 py-4">
        <div className="absolute top-1/2 left-6 right-6 h-1 bg-[var(--color-fog)] -translate-y-1/2" />

        <div
          className="absolute top-1/2 left-6 h-1 bg-[var(--color-flash)] -translate-y-1/2 transition-all duration-700"
          style={{ width: `calc(${progressPercentage}% - 3rem)` }}
        />

        {steps.map((step, index) => {
          const isCurrent = index === statusIndex;
          const isDone = index < statusIndex;
          const Icon = ORDER_STEP_ICONS[step.status];

          return (
            <div
              key={step.status}
              className="relative z-10 flex flex-col items-center gap-2 bg-[var(--color-paper)] px-3"
            >
              <div
                className={`w-11 h-11 border-2 border-[var(--color-ink)] flex items-center justify-center transition-all ${
                  isCurrent
                    ? "bg-[var(--color-volt)] text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] scale-110"
                    : isDone
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "bg-[var(--color-bone)] text-[var(--color-ink-muted)]"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p
                  className={`mono-label ${
                    isCurrent
                      ? "text-[var(--color-flash)] font-extrabold"
                      : isDone
                      ? "text-[var(--color-ink)] font-bold"
                      : "text-[var(--color-ink-muted)]"
                  }`}
                >
                  0{index + 1} · {step.status}
                </p>
                <p className="font-mono text-[10px] text-[var(--color-ink-muted)] mt-0.5">
                  {formatDateTime(step.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
