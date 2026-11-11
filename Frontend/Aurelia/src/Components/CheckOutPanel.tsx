import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { DiaChiContext } from "../contexts/DiaChiContext";
import { PaymentOptions } from "../Components/MockPayment.tsx/PaymentOptions";
import { useNavigate } from "react-router-dom";
import { Toaster } from "../Components/Toaster";
import { LoadingOverlay } from "../Components/LoadingOverlay";
import { v4 as uuidv4 } from "uuid";
import type { order } from "../types/type";
import { ListCoupon } from "../Components/ListCoupon";
import { AdminContext } from "../contexts/AdminContext";
import { CheckOutForm } from "../Components/CheckOutComponents/CheckOutForm";
import { ChevronLeft, CheckSquare } from "lucide-react";

export const CheckOutPanel = () => {
  const { CartDataAdd, setDataOrder, LayToaDo, LayPhiVanCHuyen } =
    useContext(CartContext);
  const { selectvoucher } = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<order | undefined>(undefined);
  const [typeShip, setTypeShip] = useState<string>("standard");
  const { savedAddress = [], SaveDiaChi } = useContext(DiaChiContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment: "cod",
  });
  const [saveAddressCheck, setSaveAddressCheck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toaDo, setToaDo] = useState<{ lat?: number; lon?: number }>();

  const now = new Date();
  const isoUTC = now.toISOString().replace("Z", "+00:00");

  useEffect(() => {
    if (!formData.address) return;
    const timeout = setTimeout(async () => {
      const res = await LayToaDo(formData.address);
      setToaDo({ lat: res?.lat, lon: res?.lon });
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.address, LayToaDo]);

  useEffect(() => {
    const data: order = {
      orderId: uuidv4(),
      status: "Chờ Xác Nhận",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      payment: formData.payment,
      product: CartDataAdd,
      voucherUsed: selectvoucher,
      lat: toaDo?.lat,
      ion: toaDo?.lon,
      ngayTaoDon: isoUTC,
      tracking: {
        updateTime: new Date().toISOString().replace("Z", "+00:00"),
        lat: 0,
        lon: 0,
      },
    };
    setDataOrder(data);
    setOrder(data);
    LayPhiVanCHuyen(true);
  }, [formData, toaDo, CartDataAdd, typeShip, isoUTC, LayPhiVanCHuyen, selectvoucher, setDataOrder]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!CartDataAdd.length) {
      Toaster("Giỏ hàng của bạn đang trống!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (saveAddressCheck) {
        await SaveDiaChi({
          hoVaTen: formData.name,
          soDT: formData.phone,
          diaChi: formData.address,
          email: formData.email,
        });
        Toaster("Đã lưu địa chỉ thành công!", "success");
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate(`/payment/${formData.payment}`);
    } catch {
      Toaster("Lưu địa chỉ thất bại! Vui lòng thử lại.", "error");
    } finally {
      setIsSubmitting(false);
      LayPhiVanCHuyen(false);
    }
  };

  return (
    <>
      <LoadingOverlay
        isLoading={isSubmitting}
        message="Đang xử lý đơn hàng..."
      />
      <div className="w-full">
        <ListCoupon
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dataOrder={CartDataAdd}
          order={order}
        />

        <div className="mb-8 pb-4 border-b-2 border-[var(--color-ink)] flex items-end justify-between gap-4">
          <div>
            <div className="mono-label text-[var(--color-ink-muted)] mb-1">
              [CHECKOUT SETTLEMENT · FORM-01]
            </div>
            <h1 className="display-m font-display-safe text-[var(--color-ink)]">
              Xác Nhận Đơn Hàng
            </h1>
          </div>
          <span className="hud-chip bg-[var(--color-bone)]">SSL-256</span>
        </div>

        <div className="space-y-8">
          <CheckOutForm
            formData={formData}
            setFormData={setFormData}
            saveAddress={savedAddress}
            typeShip={typeShip}
            setTypeShip={setTypeShip}
          />

          <div className="pt-6 border-t-2 border-[var(--color-ink)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label">
                  03
                </span>
                <h2 className="font-display-safe font-extrabold text-base uppercase text-[var(--color-ink)]">
                  Thanh Toán · Method Selection
                </h2>
              </div>
              <span className="mono-label text-[var(--color-ink-muted)]">
                [SELECT 1]
              </span>
            </div>
            <PaymentOptions value={formData.payment} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-3 p-3.5 border-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
            <input
              type="checkbox"
              id="saveAddressCheck"
              checked={saveAddressCheck}
              onChange={(e) => setSaveAddressCheck(e.target.checked)}
              className="h-5 w-5 accent-[var(--color-ink)] border-2 border-[var(--color-ink)] cursor-pointer"
            />
            <label
              htmlFor="saveAddressCheck"
              className="mono-label text-[var(--color-ink)] cursor-pointer select-none flex items-center gap-2"
            >
              <CheckSquare size={14} className="text-[var(--color-flash)]" />
              <span>Lưu địa chỉ này vào hồ sơ tài khoản</span>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t-2 border-[var(--color-ink)]">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="min-h-[48px] px-5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] inline-flex items-center justify-center gap-2 mono-label text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] transition-colors cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Quay lại giỏ hàng</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="min-h-[52px] px-8 py-3.5 border-2 border-[var(--color-ink)] bg-[var(--color-flash)] text-[var(--color-paper)] shadow-[var(--shadow-hard)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[var(--shadow-hard-lg)] transition-all font-mono font-extrabold text-xs uppercase tracking-wider cursor-pointer"
            >
              HOÀN TẤT ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOutPanel;
