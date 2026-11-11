import { useContext, useState } from "react";
import {
  Search,
  Star,
  Mail,
  Phone,
  TrendingUp,
  ShoppingBag,
  Award,
} from "lucide-react";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { CartContext } from "../../contexts/CartContext";
import { SplitFlap } from "../UI";
import type { DiaChi, order } from "../../types/type";

export default function ListCustomer() {
  const [search, setSearch] = useState("");
  const { formatPrice } = useContext(CartContext);
  const { dataCustomer, totalCustomer, totaldoanhthu, avgchitieu } =
    useContext(DashBoardShopCOntext);

  const filtered = dataCustomer?.filter(
    (c) =>
      c?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-bone)] p-4 md:p-6 space-y-8">
      <header className="p-6 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)]">
        <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
          [CONTROL ROOM // CLIENTELE]
        </span>
        <h1 className="display-l font-display-safe text-[var(--color-ink)] mt-2">
          Khách hàng
        </h1>
        <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
          Quản lý hồ sơ và hành vi khách hàng của bạn
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: "Tổng khách hàng",
            value: String(totalCustomer ?? 0),
            icon: Award,
          },
          {
            title: "Tổng doanh thu",
            value: `${formatPrice(totaldoanhthu)}`,
            icon: TrendingUp,
          },
          {
            title: "Trung bình / KH",
            value: `${formatPrice(avgchitieu)}`,
            icon: ShoppingBag,
          },
        ].map(({ title, value, icon: Icon }, i) => (
          <div
            key={i}
            className="bg-[var(--color-paper)] p-5 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] flex flex-col justify-between gap-4"
          >
            <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--color-ink)] pb-2">
              <p className="mono-label text-[var(--color-ink-muted)]">{title}</p>
              <div className="w-10 h-10 bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center">
                <Icon size={18} />
              </div>
            </div>
            <SplitFlap value={value} size="sm" />
          </div>
        ))}
      </section>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm khách hàng theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-h-[48px] pl-12 pr-5 py-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] font-mono text-xs outline-none focus:bg-[var(--color-volt)]/15"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered && filtered.length > 0 ? (
          filtered.map((c) => (
            <div
              key={c.id}
              className="relative bg-[var(--color-paper)] p-6 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] flex flex-col justify-between"
            >
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-[var(--color-volt)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] mono-label font-extrabold flex items-center gap-1">
                <Star size={11} className="fill-current" />
                {c.tier}
              </div>

              <div>
                <div className="flex items-center gap-4 mb-5 pb-4 border-b-2 border-[var(--color-ink)]">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-14 h-14 object-cover border-2 border-[var(--color-ink)] bg-[var(--color-bone)]"
                  />
                  <div className="flex-1 min-w-0 pr-16">
                    <h2 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)] truncate">
                      {c.name}
                    </h2>
                    <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                      ID: #{c.id?.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 mb-5 font-mono text-xs">
                  <div className="flex items-center gap-3 text-[var(--color-ink)]">
                    <div className="w-8 h-8 bg-[var(--color-bone)] border border-[var(--color-ink)] flex items-center justify-center shrink-0">
                      <Mail size={14} className="text-[var(--color-flash)]" />
                    </div>
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--color-ink)]">
                    <div className="w-8 h-8 bg-[var(--color-bone)] border border-[var(--color-ink)] flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-[var(--color-flash)]" />
                    </div>
                    <span className="truncate">
                      {c.thongTinDatHang
                        ?.map((item: DiaChi) => item.soDT)
                        .join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-[var(--color-ink)] pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                      Tổng chi tiêu
                    </p>
                    <p className="font-mono text-base font-extrabold text-[var(--color-flash)] tabular-nums">
                      {c?.donHangCuaBan
                        ?.flatMap((d: order) => d.product)
                        ?.reduce(
                          (sum: number, item) =>
                            sum + item.price * item.quantity,
                          0
                        )
                        ?.toFixed(1)}
                      M₫
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                      Đơn hàng
                    </p>
                    <p className="font-mono text-base font-extrabold text-[var(--color-ink)] tabular-nums">
                      {c.donHangCuaBan?.length || 0}
                    </p>
                  </div>
                </div>

                <button className="w-full min-h-[44px] py-2.5 text-[var(--color-paper)] bg-[var(--color-ink)] hover:bg-[var(--color-flash)] border-2 border-[var(--color-ink)] mono-label font-extrabold transition-colors cursor-pointer">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-[var(--color-paper)] border-2 border-dashed border-[var(--color-ink)]">
            <div className="w-16 h-16 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] flex items-center justify-center mx-auto mb-4">
              <Search className="text-[var(--color-ink-muted)]" size={28} />
            </div>
            <h3 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)] mb-1">
              Không tìm thấy khách hàng
            </h3>
            <p className="font-mono text-xs text-[var(--color-ink-muted)]">
              Hãy thử tìm bằng tên khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
