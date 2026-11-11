import { useContext, useEffect, useState } from "react";
import { MapPin, Trash2, Truck } from "lucide-react";
import type { DiaChi } from "../../types/type";
import { DiaChiContext } from "../../contexts/DiaChiContext";
import { CartContext } from "../../contexts/CartContext";
import { formatVND } from "../../utils/formatters";
import { Equalizer, Ticket } from "../UI";

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  payment: string;
}

const INPUT_CLASS =
  "w-full min-h-[48px] border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3.5 py-2.5 text-xs font-mono text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:border-[var(--color-ink)] focus:bg-[var(--color-volt)]/15 focus:shadow-[var(--shadow-hard-sm)] outline-none transition-all";

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    title: "GIAO TIÊU CHUẨN",
    subtitle: "2-3 NGÀY TOÀN QUỐC",
    badge: "MIỄN PHÍ",
    badgeClass: "text-[var(--color-ink)]",
  },
  {
    id: "express",
    title: "GIAO HỎA TỐC",
    subtitle: "24 GIỜ NỘI THÀNH",
    badge: "+25.000 ₫",
    badgeClass: "text-[var(--color-flash)] tabular-nums",
  },
] as const;

export const CheckOutForm = ({
  formData,
  setFormData,
  saveAddress,
  typeShip,
  setTypeShip,
}: {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  saveAddress: DiaChi[];
  typeShip: string;
  setTypeShip: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { XoaDiaChi } = useContext(DiaChiContext);
  const { phiVanChuyen, distance } = useContext(CartContext);

  const [name, setName] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    city: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: `${name.firstName} ${name.lastName}`.trim(),
      address: `${name.addressLine1}, ${name.city}`.trim(),
    }));
  }, [name, setFormData]);

  const handleSelectAddress = (addr: DiaChi) => {
    setFormData({
      name: addr.hoVaTen,
      phone: addr.soDT,
      address: addr.diaChi,
      email: addr.email || "",
      payment: formData.payment,
    });
  };

  return (
    <div className="space-y-8">
      {saveAddress.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-2">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[var(--color-flash)]" />
              <h3 className="font-display-safe font-extrabold text-sm uppercase text-[var(--color-ink)]">
                Chọn Địa Chỉ Đã Lưu ({saveAddress.length})
              </h3>
            </div>
            <span className="mono-label text-[var(--color-ink-muted)]">
              [SAVED TICKETS]
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {saveAddress.map((addr, idx) => {
              const isSelected =
                formData.address === addr.diaChi &&
                formData.phone === addr.soDT;
              return (
                <Ticket
                  key={`${addr.diaChi}-${idx}`}
                  selected={isSelected}
                  stub={
                    <button
                      type="button"
                      onClick={() => XoaDiaChi(addr)}
                      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-danger)] hover:text-[var(--color-paper)] text-[var(--color-ink)] transition-colors cursor-pointer"
                      aria-label="Xóa địa chỉ"
                    >
                      <Trash2 size={14} />
                    </button>
                  }
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAddress(addr)}
                    className="w-full text-left cursor-pointer"
                  >
                    <p className="font-mono text-xs font-extrabold text-[var(--color-ink)]">
                      {addr.hoVaTen} · {addr.soDT}
                    </p>
                    <p className="font-sans text-xs text-[var(--color-ink-muted)] mt-1">
                      {addr.diaChi}
                    </p>
                  </button>
                </Ticket>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label">
              01
            </span>
            <h2 className="font-display-safe font-extrabold text-base uppercase text-[var(--color-ink)]">
              Giao Hàng · Thông Tin & Địa Chỉ
            </h2>
          </div>
          <span className="mono-label text-[var(--color-ink-muted)]">
            [DESTINATION SPEC]
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block mono-label text-[var(--color-ink)] mb-1.5">
              EMAIL NHẬN THÔNG BÁO VẬN ĐƠN
            </label>
            <input
              className={INPUT_CLASS}
              placeholder="ten@domain.com"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mono-label text-[var(--color-ink)] mb-1.5">
              HỌ & ĐỆM
            </label>
            <input
              className={INPUT_CLASS}
              placeholder="Nguyễn"
              type="text"
              value={name.firstName}
              onChange={(e) => setName({ ...name, firstName: e.target.value })}
            />
          </div>

          <div>
            <label className="block mono-label text-[var(--color-ink)] mb-1.5">
              TÊN
            </label>
            <input
              className={INPUT_CLASS}
              placeholder="Văn A"
              type="text"
              value={name.lastName}
              onChange={(e) => setName({ ...name, lastName: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mono-label text-[var(--color-ink)] mb-1.5">
              SỐ ĐIỆN THOẠI LIÊN HỆ
            </label>
            <input
              className={INPUT_CLASS}
              placeholder="0912 345 678"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mono-label text-[var(--color-ink)] mb-1.5">
              ĐỊA CHỈ NHÀ / SỐ PHÒNG / TÒA NHÀ
            </label>
            <input
              className={INPUT_CLASS}
              placeholder="Số nhà, ngõ ngách, tên đường..."
              type="text"
              value={name.addressLine1}
              onChange={(e) =>
                setName({ ...name, addressLine1: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mono-label text-[var(--color-ink)] mb-1.5">
              TỈNH / THÀNH PHỐ
            </label>
            <input
              value={name.city}
              className={INPUT_CLASS}
              placeholder="Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
              type="text"
              onChange={(e) => setName({ ...name, city: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label">
              02
            </span>
            <h2 className="font-display-safe font-extrabold text-base uppercase text-[var(--color-ink)]">
              Vận Chuyển · Phương Thức & Cước Phí
            </h2>
          </div>
          <span className="mono-label text-[var(--color-ink-muted)]">
            [LOGISTICS]
          </span>
        </div>

        <div className="p-4 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Truck size={18} className="text-[var(--color-flash)] shrink-0" />
            <div>
              <div className="mono-label text-[var(--color-ink)]">
                ĐỊNH TUYẾN KHOẢNG CÁCH KHO ATELIER
              </div>
              <div className="text-xs font-mono text-[var(--color-ink-muted)] mt-0.5">
                {distance
                  ? `Khoảng cách ước tính: ${Number(distance).toFixed(1)} km · Cước: ${formatVND(phiVanChuyen)}`
                  : "Nhập địa chỉ để hệ thống đo khoảng cách tự động"}
              </div>
            </div>
          </div>
          {!distance && formData.address && <Equalizer label="ĐANG TÍNH" />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SHIPPING_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTypeShip(option.id)}
              className={`min-h-[64px] p-4 border-2 border-[var(--color-ink)] text-left flex items-center justify-between gap-3 cursor-pointer transition-all relative ${
                typeShip === option.id
                  ? "bg-[var(--color-volt)]/30 shadow-[var(--shadow-hard)]"
                  : "bg-[var(--color-paper)] hover:bg-[var(--color-bone)]"
              }`}
            >
              <div>
                <div className="mono-label font-extrabold text-[var(--color-ink)]">
                  {option.title}
                </div>
                <div className="text-[11px] font-mono text-[var(--color-ink-muted)] mt-0.5">
                  {option.subtitle}
                </div>
              </div>
              <span
                className={`px-2 py-1 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] mono-label font-extrabold ${option.badgeClass}`}
              >
                {option.badge}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CheckOutForm;
