import { Volume2, VolumeX, Zap } from "lucide-react";
import { Equalizer } from "../UI/primitives/Meter";
import { cn } from "../../utils/cn";

export type StageLightMode = "volt" | "flash" | "spot";

const LIGHT_MODES: { id: StageLightMode; label: string; dotClass: string }[] = [
  { id: "volt", label: "VOLT BEAM", dotClass: "bg-volt" },
  { id: "flash", label: "FLASH PYRO", dotClass: "bg-flash" },
  { id: "spot", label: "SPOTLIGHT", dotClass: "bg-paper" },
];

export interface ConcertStageBarProps {
  lightMode: StageLightMode;
  onChangeLightMode: (mode: StageLightMode) => void;
  audioOn: boolean;
  onToggleAudio: () => void;
  beatStep: number;
  featuredCount: number;
}

export function ConcertStageBar({
  lightMode,
  onChangeLightMode,
  audioOn,
  onToggleAudio,
  beatStep,
  featuredCount,
}: ConcertStageBarProps) {
  const isBeatPulse = beatStep >= 0 && beatStep % 2 === 0;

  return (
    <div className="relative z-20 border-b-[3px] border-ink bg-ink text-paper">
      {/* Steel X-Truss structural framing strip */}
      <div
        aria-hidden="true"
        className="concert-truss h-3.5 w-full border-b-2 border-paper/20"
      />

      <div className="container-atelier flex flex-wrap items-center justify-between gap-3 py-2.5">
        {/* Left: Live concert beacon & Equalizer */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-flash bg-flash/15 px-2 py-0.5 mono-label text-[10px] font-extrabold text-paper">
            <span className="h-2 w-2 rounded-full bg-flash animate-rec" aria-hidden="true" />
            LIVE ON STAGE
          </span>
          <span className="mono-label text-[11px] font-extrabold tracking-wider text-volt">
            AURELIA WORLD TOUR &apos;26 // MAIN ARENA
          </span>
          <span className="hidden items-center gap-2 border-l border-paper/25 pl-3 sm:inline-flex">
            <Equalizer
              bars={7}
              label="Stage Equalizer"
              className={cn(
                "h-3.5 [&>span]:w-1 [&>span]:bg-volt",
                isBeatPulse && "scale-y-110 transition-transform"
              )}
            />
            <span className="mono-label text-[10px] font-bold text-fog">
              120 BPM · MERCH {String(featuredCount).padStart(2, "0")}
            </span>
          </span>
        </div>

        {/* Right: Lighting rig switcher & optional Web Audio Soundcheck toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Điều khiển đèn sân khấu"
            className="flex items-center border border-paper/30 bg-ink p-0.5 rounded-[2px]"
          >
            <span className="hidden px-2 mono-label text-[9px] font-bold text-fog md:inline-flex items-center gap-1">
              <Zap size={11} className="text-volt" aria-hidden="true" />
              RIG:
            </span>
            {LIGHT_MODES.map((m) => {
              const active = lightMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeLightMode(m.id)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 mono-label text-[10px] font-extrabold transition-colors cursor-pointer rounded-[1px]",
                    active
                      ? "bg-volt text-ink"
                      : "text-fog hover:text-paper"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 rounded-full border border-ink",
                      m.dotClass
                    )}
                  />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onToggleAudio}
            aria-pressed={audioOn}
            className={cn(
              "press-collapse inline-flex items-center gap-1.5 border px-2.5 py-1 mono-label text-[10px] font-extrabold transition-colors cursor-pointer rounded-[2px]",
              audioOn
                ? "border-volt bg-volt text-ink"
                : "border-paper/40 bg-ink text-paper hover:border-volt hover:text-volt"
            )}
          >
            {audioOn ? (
              <Volume2 size={13} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <VolumeX size={13} strokeWidth={2.5} aria-hidden="true" />
            )}
            <span>{audioOn ? "SOUNDCHECK: ON" : "SOUNDCHECK AUDIO"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

