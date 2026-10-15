import { motion } from "framer-motion";
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
import { ChevronLeft } from "lucide-react";

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
  }, [formData.address]);

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
  }, [formData, toaDo, CartDataAdd, typeShip]);

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
      <div className="w-full pb-12">
        <ListCoupon
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dataOrder={CartDataAdd}
          order={order}
        />

        <div className="mb-8 pb-4 border-b border-[var(--color-rule)]">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
            CHECKOUT SETTLEMENT
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)] uppercase tracking-tight">
            Xác Nhận Đơn Hàng
          </h1>
        </div>

        <div className="space-y-8">
          <CheckOutForm
            formData={formData}
            setFormData={setFormData}
            saveAddress={savedAddress}
            typeShip={typeShip}
            setTypeShip={setTypeShip}
          />

          <div className="pt-4 border-t border-[var(--color-rule)]">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-2">
              METHOD SELECTION
            </div>
            <PaymentOptions value={formData.payment} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="saveAddressCheck"
              checked={saveAddressCheck}
              onChange={(e) => setSaveAddressCheck(e.target.checked)}
              className="h-3.5 w-3.5 rounded-none border border-[var(--color-rule)] text-[var(--color-ink)] cursor-pointer"
            />
            <label htmlFor="saveAddressCheck" className="text-xs font-mono text-[var(--color-ink-muted)] cursor-pointer select-none">
              Lưu địa chỉ này vào hồ sơ tài khoản
            </label>
          </div>

          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-[var(--color-rule)]">
            <button
              onClick={() => navigate("/cart")}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Quay lại giỏ hàng</span>
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary py-3.5 px-8 rounded-none font-mono text-xs uppercase tracking-wider"
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
