import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-6 pb-12">
      <div
        className="relative group cursor-pointer overflow-hidden rounded-none border border-[var(--color-rule)]"
        onClick={() => navigate("/Fashion/Products")}
      >
        <div
          className="aspect-[16/9] lg:aspect-[21/9] w-full bg-cover bg-center bg-no-repeat transition-transform duration-[1.5s] ease-out group-hover:scale-102"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2100')",
          }}
        />
        <div className="absolute inset-0 bg-[var(--color-ink)]/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[var(--color-bg)] p-6">
          <div className="inline-block border border-[var(--color-bg)]/40 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--color-bg)] mb-3">
            SEASONAL ARCHIVE · 2026 CATALOGUE
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-[var(--color-bg)]">
            Mục Lục Bộ Sưu Tập
          </h1>

          <p className="mt-2 text-xs sm:text-sm font-mono text-[var(--color-bg)]/80 max-w-lg uppercase tracking-wider">
            Tuyển tập thiết kế may đo phân chia theo niên độ và vật liệu dệt
          </p>

          <button className="mt-6 btn btn-primary rounded-none text-xs font-mono font-bold uppercase tracking-wider group inline-flex items-center gap-2">
            <span>Xem Danh Mục Sản Phẩm</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
