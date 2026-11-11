import type { Cart, order } from "../../types/type";
import { formatDateOnly, formatVND } from "../../utils/formatters";
import Timeline from "./TimeLine";

interface TrackingSidebarData {
  data?: order;
  product?: Cart[];
  status?: string;
  ngayTaoDon?: string;
  address?: string;
  tracking?: {
    updateTime: string;
    lat: number;
    lon: number;
  };
}

const Sidebar = ({ data }: { data?: TrackingSidebarData }) => {
  const orderObj = data?.data || (data as unknown as order | undefined);
  const products = data?.product || data?.data?.product || [];

  return (
    <div className="h-full w-full bg-[var(--color-paper)] flex flex-col p-6 md:p-8 overflow-y-auto">
      <div className="mb-6 pb-4 border-b-2 border-[var(--color-ink)]">
        <div className="flex justify-between items-start mb-2">
          <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
            [TRACKING MANIFEST]
          </span>
          <span className="px-2 py-0.5 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] mono-label text-[10px]">
            {orderObj?.orderId?.slice(0, 8)}
          </span>
        </div>
        <h1 className="display-m font-display-safe text-[var(--color-ink)] mt-2">
          Order #{orderObj?.orderId?.slice(0, 8)}
        </h1>
        <p className="mono-label text-[var(--color-ink-muted)] mt-1">
          Estimated Delivery:{" "}
          <span className="text-[var(--color-flash)] font-extrabold">
            {formatDateOnly(orderObj?.ngayTaoDon)}
          </span>
        </p>
      </div>

      {products.map((item: Cart, idx: number) => (
        <div
          key={item.itemid || idx}
          className="flex gap-4 border-2 border-[var(--color-ink)] p-3 mb-3 items-center bg-[var(--color-bone)]"
        >
          <div
            className="h-16 w-16 bg-cover bg-center border-2 border-[var(--color-ink)] shrink-0"
            style={{ backgroundImage: `url(${item.thumnail})` }}
          />
          <div className="flex flex-col justify-center">
            <h3 className="font-display-safe font-extrabold text-sm uppercase text-[var(--color-ink)]">
              {item.name}
            </h3>
            <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1 tabular-nums">
              {item.quantity} x {formatVND(item.price)}
            </p>
          </div>
        </div>
      ))}

      <Timeline data={orderObj} />

      <div className="mt-auto border-t-2 border-[var(--color-ink)] pt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="mono-label text-[10px] text-[var(--color-ink-muted)] mb-1">
            Courier
          </p>
          <p className="font-mono font-extrabold text-xs text-[var(--color-ink)]">
            AURELIA EXPRESS
          </p>
        </div>
        <div className="text-right">
          <p className="mono-label text-[10px] text-[var(--color-ink-muted)] mb-1">
            Service
          </p>
          <p className="font-mono font-extrabold text-xs text-[var(--color-ink)]">
            PRIORITY OVERNIGHT
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 min-h-[48px] flex items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] text-[var(--color-ink)] mono-label font-extrabold transition-colors cursor-pointer">
          View Receipt
        </button>
        <button className="flex-1 min-h-[48px] flex items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-ink)] hover:bg-[var(--color-flash)] text-[var(--color-paper)] mono-label font-extrabold transition-colors cursor-pointer">
          Contact Concierge
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
