import { X, MapPin, Phone, Clock, CalendarCheck } from "lucide-react";
import React, { useContext, type SetStateAction, useState } from "react";
import type { Product } from "../types/type";
import { StoreContext } from "../contexts/Store";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../utils/formatters";
import { Ticket } from "./UI/primitives/Ticket";
import { Button } from "./UI/primitives/Button";
import { sizeTileClass } from "./UI/primitives/recipes";

type ProductFindProps = {
  product: Product;
  setState: React.Dispatch<SetStateAction<boolean>>;
};

export const TimKiemTaiStore: React.FC<ProductFindProps> = ({
  product,
  setState,
}) => {
  const { GetStore, dataStore, setAppointmentProduct } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    GetStore(product.id, size.toUpperCase());
  };
  const navigate = useNavigate();
  const handleClickAppointment = (item: Product, shopId: string) => {
    navigate(`/BookingAppointment/${shopId}`);
    setAppointmentProduct({
      id: item.id,
      thumbnail: item.images?.[1] || item.thumbnail,
      name: item.name,
      size: selectedSize ?? "",
      price: item.price,
    });
  };

  return (
    <div className="space-y-6 text-ink">
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <div>
          <span className="mono-label text-[10px] font-bold text-ink-muted">
            [STORE LOCATOR // BOUTIQUE STOCK]
          </span>
          <h2 className="font-display text-lg font-extrabold uppercase text-ink diacritic-safe">
            Tìm Kiếm Tại Store
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setState(false)}
          aria-label="Đóng"
          className="press-collapse flex h-11 w-11 items-center justify-center border-2 border-ink bg-paper hover:bg-volt cursor-pointer rounded-[2px]"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Product summary card */}
        <div className="flex flex-col items-center gap-3 border-2 border-ink bg-bone p-4 rounded-[2px]">
          <img
            src={product.images?.[1] || product.thumbnail}
            alt={product.name}
            className="aspect-[3/4] w-full border-2 border-ink bg-paper object-cover"
          />
          <h3 className="text-center font-display text-base font-extrabold uppercase text-ink diacritic-safe">
            {product.name}
          </h3>
          <p className="mono-label text-xs font-bold text-ink-muted">
            {product.brand}
          </p>
          <p className="font-mono text-lg font-black tabular text-ink">
            {formatVND(product.price)}
          </p>
        </div>

        {/* Size selector + Boutique list */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <div className="border-2 border-ink bg-paper p-4 rounded-[2px]">
            <h4 className="mono-label mb-3 text-xs font-extrabold text-ink">
              Hãy chọn một size để tìm kiếm cửa hàng
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.variants?.flatMap((variant) =>
                variant.sizes?.map((size, idx) => (
                  <button
                    key={`${variant.color}-${size.size}-${idx}`}
                    type="button"
                    onClick={() => handleSelectSize(size.size)}
                    className={sizeTileClass(selectedSize === size.size, false)}
                  >
                    {size.size}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="w-full">
            <h4 className="mono-label mb-3 border-b-2 border-ink pb-2 text-xs font-extrabold text-ink">
              [BOUTIQUES // AVAILABLE LOCATIONS]
            </h4>
            {dataStore.length === 0 ? (
              <p className="border-2 border-dashed border-ink bg-bone p-6 text-center text-sm text-ink-muted">
                Vui lòng chọn size để tìm kiếm cửa hàng.
              </p>
            ) : (
              <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
                {dataStore.map((item, i) => (
                  <Ticket key={i} notchClassName="bg-paper" className="bg-bone">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-display text-base font-extrabold uppercase text-ink diacritic-safe">
                          {item.shopName}
                        </h5>
                        <span className="border-2 border-ink bg-volt px-2 py-0.5 mono-label text-[10px] font-bold text-ink">
                          Limited stock
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-ink-muted">
                        <p className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-ink" />
                          <span>
                            {item.address} — {item.city}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone size={13} className="text-ink" />
                          <span className="font-mono font-bold text-ink">
                            {item.phone}
                          </span>
                        </p>
                        <p>Owner: {item.owner}</p>
                        <p className="flex items-center gap-1.5 font-semibold text-ink">
                          <Clock size={13} />
                          <span>Open: {item.openingHours}</span>
                        </p>
                      </div>
                      <div className="pt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleClickAppointment(product, item.shopId)
                          }
                          iconLeft={<CalendarCheck size={14} />}
                        >
                          Đặt Lịch Hẹn
                        </Button>
                      </div>
                    </div>
                  </Ticket>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
