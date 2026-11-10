import { useState } from "react";
import { SceneCanvas } from "./SceneCanvas";
import { FloatingBlobs } from "./FloatingBlobs";
import { ModelLoader } from "./ModelLoader";
import { Box, Sparkles, Image as ImageIcon } from "lucide-react";

export interface HeroSceneProps {
  modelUrl?: string;
  fallbackImage?: string;
  className?: string;
}

export function HeroScene({
  modelUrl,
  fallbackImage,
  className = "",
}: HeroSceneProps) {
  const [mode, setMode] = useState<"3d" | "photo">("3d");

  return (
    <div className={`relative w-full h-full min-h-[380px] md:min-h-[460px] rounded-[var(--radius-2xl)] overflow-hidden bg-gradient-to-tr from-[var(--color-peach-100)]/70 via-[var(--color-cream-100)] to-[var(--color-sage-light)]/40 border border-[var(--color-cream-300)] shadow-[var(--shadow-card)] ${className}`}>
      {mode === "3d" ? (
        <SceneCanvas
          fallbackImage={fallbackImage}
          fallbackLabel="3D Shape Preview"
          cameraPosition={[0, 0, 5.5]}
        >
          {modelUrl ? (
            <ModelLoader url={modelUrl} />
          ) : (
            <FloatingBlobs />
          )}
        </SceneCanvas>
      ) : (
        fallbackImage ? (
          <img
            src={fallbackImage}
            alt="Hero Visual"
            className="w-full h-full object-cover"
          />
        ) : null
      )}

      {fallbackImage && (
        <div className="absolute top-4 right-4 z-20 flex items-center bg-white/90 backdrop-blur-md rounded-[var(--radius-pill)] p-1 shadow-xs border border-[var(--color-cream-300)]">
          <button
            type="button"
            onClick={() => setMode("3d")}
            className={`px-3 py-1 rounded-[var(--radius-pill)] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === "3d"
                ? "bg-[var(--color-accent)] text-white shadow-xs"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Box size={13} />
            <span>3D Shape</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("photo")}
            className={`px-3 py-1 rounded-[var(--radius-pill)] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === "photo"
                ? "bg-[var(--color-ink)] text-white shadow-xs"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            }`}
          >
            <ImageIcon size={13} />
            <span>Hình ảnh</span>
          </button>
        </div>
      )}

      {mode === "3d" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] bg-white/80 backdrop-blur-xs text-[11px] font-semibold text-[var(--color-ink)] shadow-xs">
            <Sparkles size={12} className="text-[var(--color-accent)]" />
            <span>Kéo chuột để xoay 3D</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default HeroScene;
