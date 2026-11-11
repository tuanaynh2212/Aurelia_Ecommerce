import { Package, User, MapPin, Calendar, X } from "lucide-react";
import type { order } from "../../../types/type";
import { Badge } from "../../UI";

export const PopUpDetail = ({
  data,
  onClose,
  orderId,
}: {
  data: order[] | undefined;
  onClose: () => void;
  orderId: string;
}) => {
  const shop = localStorage.getItem("shop");
  const shopParsed = shop ? JSON.parse(shop) : null;
  const orderData = data?.filter((order) => order.orderId === orderId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/70 p-4">
      <div className="relative bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] w-full max-w-3xl p-6 md:p-8 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 min-w-[40px] min-h-[40px] inline-flex items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-flash)] hover:text-[var(--color-paper)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-3 border-b-2 border-[var(--color-ink)]">
          <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
            [ORDER MANIFEST]
          </span>
          <h2 className="display-m font-display-safe text-[var(--color-ink)] mt-2">
            Chi tiết đơn hàng
          </h2>
        </div>

        {orderData?.map((order) => (
          <div
            key={order.orderId}
            className="border-2 border-[var(--color-ink)] bg-[var(--color-bone)] p-5 mb-4 space-y-5"
          >
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b-2 border-[var(--color-ink)]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[var(--color-flash)]" />
                <span className="font-mono font-extrabold text-sm text-[var(--color-ink)]">
                  Mã đơn: #{order.orderId}
                </span>
              </div>
              <div className="flex items-center gap-2 mono-label text-[var(--color-ink-muted)]">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(order.ngayTaoDon).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start gap-3">
                  <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-2">
                    <User className="w-4 h-4 text-[var(--color-flash)]" />
                  </div>
                  <div>
                    <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                      Khách hàng
                    </p>
                    <p className="font-extrabold text-[var(--color-ink)]">
                      {order.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-2">
                    <MapPin className="w-4 h-4 text-[var(--color-flash)]" />
                  </div>
                  <div>
                    <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                      Địa chỉ nhận hàng
                    </p>
                    <p className="text-[var(--color-ink)]">{order.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-2">
                    <MapPin className="w-4 h-4 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                      Địa chỉ giao hàng
                    </p>
                    <p className="text-[var(--color-ink)]">
                      {shopParsed?.address}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="mono-label text-[10px] text-[var(--color-ink-muted)] mb-1">
                    Trạng thái
                  </p>
                  <Badge status="info">{order.status}</Badge>
                </div>
              </div>

              <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-4 space-y-3">
                <h3 className="mono-label font-extrabold text-[var(--color-ink)] pb-2 border-b-2 border-[var(--color-ink)]">
                  Danh sách sản phẩm
                </h3>
                {order.product.map((item) => (
                  <div
                    key={item.itemid}
                    className="border-b-2 border-dashed border-[var(--color-ink)] pb-2 last:border-0"
                  >
                    <p className="font-display-safe font-extrabold text-xs uppercase text-[var(--color-ink)]">
                      {item.name}
                    </p>
                    <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                      Màu: {item.color} · Size: {item.size}
                    </p>
                    <div className="flex justify-between items-center mt-1 font-mono text-xs">
                      <span className="text-[var(--color-ink-muted)]">
                        SL: {item.quantity}
                      </span>
                      <span className="font-extrabold text-[var(--color-flash)] tabular-nums">
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
