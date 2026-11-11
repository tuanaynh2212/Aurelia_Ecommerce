import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../UI/primitives/Overlays";
import { Button } from "../UI/primitives/Button";
import { SceneShell } from "../UI/three/SceneShell";
import { HangingGarment } from "../UI/three/HangingGarment";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-6 pb-12">
      <Breadcrumb
        items={[
          { label: "HOME", to: "/" },
          { label: "SEASONAL ARCHIVE" },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-6 border-[3px] border-ink bg-paper p-6 md:p-8 shadow-hard-lg lg:grid-cols-12 rounded-[2px]">
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <span className="inline-block border-2 border-ink bg-volt px-2.5 py-0.5 mono-label text-[11px] font-extrabold text-ink">
              [SEASONAL ARCHIVE · 2026 CATALOGUE]
            </span>
            <h1 className="mt-4 display-xl font-display-safe text-ink">
              Mục Lục Bộ Sưu Tập
            </h1>
            <p className="mt-3 max-w-lg text-sm text-ink-muted">
              Tuyển tập thiết kế may đo phân chia theo niên độ và vật liệu dệt
            </p>
          </div>

          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/Fashion/Products")}
              iconRight={<ArrowRight size={16} strokeWidth={2.5} />}
            >
              Xem Danh Mục Sản Phẩm
            </Button>
          </div>
        </div>

        <div className="h-[300px] border-2 border-ink bg-bone lg:col-span-5 rounded-[2px]">
          <SceneShell
            station="RACK_AISLE"
            cameraPosition={[0, 0.1, 3.5]}
            fallbackTitle="ARCHIVE 2026"
          >
            <HangingGarment
              imageUrl="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
              width={1.55}
              height={1.95}
            />
          </SceneShell>
        </div>
      </div>
    </section>
  );
};

export default Hero;
