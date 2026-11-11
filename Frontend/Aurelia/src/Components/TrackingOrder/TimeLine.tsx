import { useMemo } from "react";
import { Check } from "lucide-react";
import type { order } from "../../types/type";
import {
  buildOrderSteps,
  getOrderStatusIndex,
  ORDER_STEP_ICONS,
} from "./orderSteps";

const Timeline = ({ data }: { data: order | undefined }) => {
  const steps = buildOrderSteps(data);
  const statusIndex = useMemo(
    () => getOrderStatusIndex(data?.status),
    [data?.status]
  );

  return (
    <div className="flex-1 overflow-y-auto pr-2 my-6">
      <div className="relative pl-3">
        <div className="absolute left-[18px] top-2 bottom-4 w-[2px] bg-[var(--color-ink)]" />

        {steps.map((step, index) => {
          const isCompleted = statusIndex > index;
          const isCurrent = statusIndex === index;
          const Icon = ORDER_STEP_ICONS[step.status];

          return (
            <div
              key={step.status}
              className={`relative flex gap-4 pb-7 ${
                statusIndex < index ? "opacity-45" : ""
              }`}
            >
              <div className="z-10 flex flex-col items-center">
                {isCompleted ? (
                  <div className="w-7 h-7 bg-[var(--color-ink)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center">
                    <Check size={13} />
                  </div>
                ) : isCurrent ? (
                  <div className="w-7 h-7 bg-[var(--color-volt)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 bg-[var(--color-paper)] text-[var(--color-ink-muted)] border-2 border-[var(--color-ink)] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <p
                  className={`font-mono text-xs uppercase tracking-wider mb-1 ${
                    isCurrent
                      ? "text-[var(--color-flash)] font-extrabold"
                      : "text-[var(--color-ink)] font-bold"
                  }`}
                >
                  0{index + 1} · {step.status}
                </p>
                {(data?.address || step.date) && (
                  <p className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                    {data?.address} {data?.address && step.date ? "·" : ""}{" "}
                    {step.date}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
