import { motion } from "framer-motion";
import { SceneShell } from "./UI/three/SceneShell";
import { Vinyl } from "./UI/three/Vinyl";

export const LoadingScreen = () => {
  return (
    <div className="studio-grid-bg fixed inset-0 z-[9999] flex flex-col items-center justify-center border-4 border-ink bg-bone">
      <div className="relative flex w-full max-w-md flex-col items-center gap-5 border-[3px] border-ink bg-paper p-8 shadow-hard-lg">
        <div className="flex w-full items-center justify-between border-b-2 border-dashed border-ink pb-2 mono-label text-[10px] font-bold text-ink-muted">
          <span>[ATELIER-01 // BOOT]</span>
          <span className="inline-flex items-center gap-1.5 text-ink">
            <span className="h-2 w-2 rounded-full bg-flash animate-rec" aria-hidden="true" />
            CALIBRATED
          </span>
        </div>

        {/* 3D Vinyl turntable stage */}
        <div className="h-44 w-full border-2 border-ink bg-bone">
          <SceneShell station="BACKSTAGE" cameraPosition={[0, 0, 4.2]}>
            <Vinyl scale={0.9} />
          </SceneShell>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-ink diacritic-safe">
            AURELIA
          </h1>
          <p className="mt-1 mono-label text-[11px] font-bold text-ink-muted">
            KINETIC ATELIER MONOLITH
          </p>
        </motion.div>

        <div className="h-3 w-full overflow-hidden border-2 border-ink bg-bone p-0.5">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            className="h-full w-1/2 bg-volt"
          />
        </div>

        <div className="barcode w-full" aria-hidden="true" />
      </div>
    </div>
  );
};

export default LoadingScreen;
