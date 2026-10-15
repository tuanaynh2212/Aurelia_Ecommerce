import { SceneCanvas } from "./SceneCanvas";
import { FloatingBlobs } from "./FloatingBlobs";
import { ModelLoader } from "./ModelLoader";
import { Sparkles } from "lucide-react";

export interface ProductViewerProps {
  modelUrl?: string;
  thumbnailUrl?: string;
  productName?: string;
  className?: string;
}

export function ProductViewer({
  modelUrl,
  thumbnailUrl,
  productName = "Sản phẩm",
  className = "",
}: ProductViewerProps) {
  return (
    <div className={`relative w-full aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden bg-gradient-to-tr from-[var(--color-peach-100)] via-[var(--color-cream-100)] to-[var(--color-sage-light)]/30 border border-[var(--color-cream-300)] shadow-sm ${className}`}>
      <SceneCanvas
        fallbackImage={thumbnailUrl}
        fallbackLabel={`3D: ${productName}`}
        cameraPosition={[0, 0, 5]}
      >
        {modelUrl ? (
          <ModelLoader url={modelUrl} />
        ) : (
          <FloatingBlobs />
        )}
      </SceneCanvas>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] bg-white/80 backdrop-blur-xs text-[10px] font-semibold text-[var(--color-ink)] shadow-xs">
          <Sparkles size={11} className="text-[var(--color-accent)]" />
          <span>Góc nhìn 3D tương tác</span>
        </span>
      </div>
    </div>
  );
}

export default ProductViewer;
