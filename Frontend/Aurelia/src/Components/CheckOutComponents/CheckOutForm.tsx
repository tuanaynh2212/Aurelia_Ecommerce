import type { DiaChi } from "../../types/type";
import { useContext, useEffect, useState } from "react";
import { DiaChiContext } from "../../contexts/DiaChiContext";

export const CheckOutForm = ({
  formData,
  setFormData,
  saveAddress,
  typeShip,
  setTypeShip,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  saveAddress: DiaChi[];
  typeShip: string;
  setTypeShip: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { XoaDiaChi } = useContext(DiaChiContext);

  const handleSelectAddress = (addr: any) => {
    setFormData({
      name: addr.hoVaTen,
      phone: addr.soDT,
      address: addr.diaChi,
      email: addr.email || "",
      payment: formData.payment,
    });
  };

  const [name, setName] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    city: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      name: `${name.firstName} ${name.lastName}`.trim(),
      address: `${name.addressLine1}, ${name.city}`.trim(),
    });
  }, [name]);

  const handleDelete = (addr: DiaChi) => XoaDiaChi(addr);

  return (
    <div className="space-y-10">
      {saveAddress.length > 0 && (
        <section>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
            SAVED RECORDS
          </div>
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-[var(--color-ink)] mb-3">
            Chọn Địa Chỉ Đã Lưu:
          </h3>
          <div className="flex flex-col border border-[var(--color-rule)] divide-y divide-[var(--color-rule)]">
            {saveAddress.map((addr: DiaChi, idx: number) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-[var(--color-bg)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => handleSelectAddress(addr)}
                  className="flex-1 text-left cursor-pointer"
                >
                  <p className="font-mono text-xs font-bold text-[var(--color-ink)]">
                    {addr.hoVaTen} · {addr.soDT}
                  </p>
                  <p className="font-body text-xs text-[var(--color-ink-muted)] mt-0.5">
                    {addr.diaChi}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr)}
                  className="ml-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)] hover:underline cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
          STEP 01 · IDENTITY
        </div>
        <div className="flex items-center justify-between mb-4 border-b border-[var(--color-rule)] pb-2">
          <h2 className="text-lg font-heading font-bold uppercase tracking-wide text-[var(--color-ink)]">
            Thông Tin Liên Hệ
          </h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
              EMAIL NHẬN THÔNG BÁO VẬN ĐƠN
            </label>
            <input
              className="w-full rounded-none border border-[var(--color-rule)] bg-[var(--color-surface)]/30 px-3.5 py-2.5 text-xs font-mono text-[var(--color-ink)] placeholder-[var(--color-ink-muted)]/50 focus:border-[var(--color-ink)] focus:bg-[var(--color-bg)] outline-none transition-colors"
              placeholder="ten@domain.com"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              defaultChecked
              className="h-3.5 w-3.5 rounded-none border border-[var(--color-rule)] text-[var(--color-ink)] cursor-pointer"
              id="newsletter"
              type="checkbox"
            />
            <label
              className="text-xs font-mono text-[var(--color-ink-muted)] cursor-pointer select-none"
              htmlFor="newsletter"
            >
              Gửi thông báo lộ trình vận đơn qua email
            </label>
          </div>
        </div>
      </section>

      <section>
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
          STEP 02 · DESTINATION
        </div>
        <h2 className="text-lg font-heading font-bold uppercase tracking-wide text-[var(--color-ink)] mb-4 border-b border-[var(--color-rule)] pb-2">
          Địa Chỉ Giao Hàng
        </h2>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
              HỌ & ĐỆM
            </label>
            <input
              className="w-full rounded-none border border-[var(--color-rule)] bg-[var(--color-surface)]/30 px-3.5 py-2.5 text-xs font-mono text-[var(--color-ink)] placeholder-[var(--color-ink-muted)]/50 focus:border-[var(--color-ink)] focus:bg-[var(--color-bg)] outline-none transition-colors"
              placeholder="Nguyễn"
              type="text"
              value={name.firstName}
              onChange={(e) => setName({ ...name, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
              TÊN
            </label>
            <input
              className="w-full rounded-none border border-[var(--color-rule)] bg-[var(--color-surface)]/30 px-3.5 py-2.5 text-xs font-mono text-[var(--color-ink)] placeholder-[var(--color-ink-muted)]/50 focus:border-[var(--color-ink)] focus:bg-[var(--color-bg)] outline-none transition-colors"
              placeholder="Văn A"
              type="text"
              value={name.lastName}
              onChange={(e) => setName({ ...name, lastName: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
              SỐ ĐIỆN THOẠI LIÊN HỆ
            </label>
            <input
              className="w-full rounded-none border border-[var(--color-rule)] bg-[var(--color-surface)]/30 px-3.5 py-2.5 text-xs font-mono text-[var(--color-ink)] placeholder-[var(--color-ink-muted)]/50 focus:border-[var(--color-ink)] focus:bg-[var(--color-bg)] outline-none transition-colors"
              placeholder="0912 345 678"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
              ĐỊA CHỈ NHÀ / SỐ PHÒNG / TÒA NHÀ
            </label>
            <input
              className="w-full rounded-none border border-[var(--color-rule)] bg-[var(--color-surface)]/30 px-3.5 py-2.5 text-xs font-mono text-[var(--color-ink)] placeholder-[var(--color-ink-muted)]/50 focus:border-[var(--color-ink)] focus:bg-[var(--color-bg)] outline-none transition-colors"
              placeholder="Số nhà, ngõ ngách, tên đường..."
              type="text"
              value={name.addressLine1}
              onChange={(e) => setName({ ...name, addressLine1: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
              TỈNH / THÀNH PHỐ
            </label>
            <input
              value={name.city}
              className="w-full rounded-none border border-[var(--color-rule)] bg-[var(--color-surface)]/30 px-3.5 py-2.5 text-xs font-mono text-[var(--color-ink)] placeholder-[var(--color-ink-muted)]/50 focus:border-[var(--color-ink)] focus:bg-[var(--color-bg)] outline-none transition-colors"
              placeholder="Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
              type="text"
              onChange={(e) => setName({ ...name, city: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
          STEP 03 · LOGISTICS
        </div>
        <h2 className="text-lg font-heading font-bold uppercase tracking-wide text-[var(--color-ink)] mb-4 border-b border-[var(--color-rule)] pb-2">
          Phương Thức Vận Chuyển
        </h2>
        <div className="rounded-none border border-[var(--color-rule)] divide-y divide-[var(--color-rule)]">
          <div
            className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors ${
              typeShip === "standard" ? "bg-[var(--color-surface)]" : "bg-[var(--color-bg)]"
            }`}
            onClick={() => setTypeShip("standard")}
          >
            <div className="flex items-center gap-3">
              <input
                checked={typeShip === "standard"}
                readOnly
                className="h-4 w-4 border-[var(--color-rule)] text-[var(--color-ink)]"
                id="standard"
                name="shipping"
                type="radio"
              />
              <label className="text-xs font-mono font-medium cursor-pointer" htmlFor="standard">
                GIAO TIÊU CHUẨN (2-3 NGÀY TOÀN QUỐC)
              </label>
            </div>
            <span className="font-mono text-xs font-bold text-[var(--color-ink)] uppercase">
              MIỄN PHÍ
            </span>
          </div>

          <div
            className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors ${
              typeShip === "express" ? "bg-[var(--color-surface)]" : "bg-[var(--color-bg)]"
            }`}
            onClick={() => setTypeShip("express")}
          >
            <div className="flex items-center gap-3">
              <input
                checked={typeShip === "express"}
                readOnly
                className="h-4 w-4 border-[var(--color-rule)] text-[var(--color-ink)]"
                id="express"
                name="shipping"
                type="radio"
              />
              <label className="text-xs font-mono font-medium cursor-pointer" htmlFor="express">
                GIAO HỎA TỐC (24 GIỜ NỘI THÀNH)
              </label>
            </div>
            <span className="font-mono text-xs font-bold text-[var(--color-ink)] tabular-nums">
              25.000 ₫
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
          STEP 04 · SETTLEMENT
        </div>
        <h2 className="text-lg font-heading font-bold uppercase tracking-wide text-[var(--color-ink)] mb-3 border-b border-[var(--color-rule)] pb-2">
          Thanh Toán
        </h2>
        <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-rule)] text-xs font-mono text-[var(--color-ink-muted)]">
          ✓ Giao dịch được mã hóa chuẩn SSL 256-bit. Lựa chọn cổng thanh toán tại bảng tổng kết đơn hàng.
        </div>
      </section>
    </div>
  );
};

export default CheckOutForm;
