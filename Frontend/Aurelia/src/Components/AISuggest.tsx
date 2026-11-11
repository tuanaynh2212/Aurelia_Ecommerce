import { useContext, useEffect, useState } from "react";
import { AiPoseMeasureContext } from "../contexts/AIPoseMeasure";
import { AuthContext } from "../contexts/Author";
import { Ticket, Stamp } from "./UI/primitives/Ticket";

type AiSuggestBoxProps = {
  productId: string;
  type: string;
  subcategory: string;
  onApplySize?: (size: string) => void;
};

export const AiSuggestBox = ({
  productId,
  type,
  subcategory,
  onApplySize,
}: AiSuggestBoxProps) => {
  const { getAIAdviceMeasure } = useContext(AiPoseMeasureContext);
  const [AIAdvice, setAIAdvice] = useState<{
    message: string;
    note: string;
    size: string;
  }>({ message: "", note: "", size: "" });
  const { isSignned } = useContext(AuthContext);

  useEffect(() => {
    if (isSignned === false) return;
    getAIAdviceMeasure(productId, type, subcategory, setAIAdvice);
  }, [productId, type, subcategory, isSignned, getAIAdviceMeasure]);

  return (
    <Ticket
      notchClassName="bg-paper"
      className="my-3 bg-bone"
      stamp={
        AIAdvice?.size ? (
          <Stamp tone="volt" animate>
            SIZE {AIAdvice.size}
          </Stamp>
        ) : undefined
      }
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="mono-label text-[10px] font-extrabold text-ink-muted">
            [SOUNDCHECK RESULT // AI SIZE ADVICE]
          </span>
        </div>

        <h2 className="font-display text-sm font-extrabold uppercase text-ink diacritic-safe">
          AI Size Recommendation
        </h2>

        {AIAdvice && (AIAdvice.size || AIAdvice.message || AIAdvice.note) ? (
          <div className="space-y-1.5 text-xs text-ink">
            {AIAdvice.size && (
              <div className="flex items-center gap-3">
                <span className="text-ink-muted">Recommended size:</span>
                <span className="inline-flex h-10 min-w-10 items-center justify-center border-2 border-ink bg-volt px-2.5 font-mono text-lg font-black text-ink">
                  {AIAdvice.size}
                </span>
                {onApplySize && (
                  <button
                    type="button"
                    onClick={() => onApplySize(AIAdvice.size)}
                    className="press-collapse min-h-[36px] border-2 border-ink bg-ink px-3 mono-label text-[10px] font-bold text-paper hover:bg-flash cursor-pointer rounded-[2px]"
                  >
                    Áp dụng
                  </button>
                )}
              </div>
            )}

            {AIAdvice.message && (
              <p className="text-xs font-medium text-ink">{AIAdvice.message}</p>
            )}

            {AIAdvice.note && (
              <p className="text-[11px] text-ink-muted">{AIAdvice.note}</p>
            )}
          </div>
        ) : (
          <p className="mono-label text-xs text-ink-muted">
            {isSignned
              ? "Analyzing your measurements…"
              : "Đăng nhập hoặc đo số đo tại Soundcheck AI để nhận gợi ý size."}
          </p>
        )}
      </div>
    </Ticket>
  );
};
