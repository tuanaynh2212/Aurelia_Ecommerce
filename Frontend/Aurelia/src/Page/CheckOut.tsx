import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { motion } from "framer-motion";
import { useContext, useMemo, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { AdminContext } from "../contexts/AdminContext";
import { OrderSummary } from "../Components/CheckOutComponents/OrderSummary";
import { CheckOutPanel } from "../Components/CheckOutPanel";
import { Stepper } from "../Components/UI";

export const Checkout = () => {
  const { CartDataAdd, phiVanChuyen } = useContext(CartContext);
  const { selectvoucher } = useContext(AdminContext);
  const [typeShip] = useState<string>("standard");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isOpen, setIsOpen] = useState(false);
  const subtotal = useMemo(() => {
    const cartTotal = CartDataAdd.reduce((s, i) => s + i.price * i.quantity, 0);
    const memberDiscount = (cartTotal * (user.benefits?.value || 0)) / 100;
    const cartAfterDiscount = cartTotal - memberDiscount;

    if (user.benefits?.freeShipping === true && user.value === 0) {
      return cartTotal;
    }
    let shippingFee = Number(phiVanChuyen) || 0;
    let voucherDiscount = 0;
    if (selectvoucher?.find((item) => item.typeCoupon === "ship")) {
      voucherDiscount =
        selectvoucher.find((item) => item.typeCoupon === "ship")?.giaTri || 0;
      shippingFee = Math.max(0, shippingFee - voucherDiscount);
    } else if (selectvoucher?.find((item) => item.typeCoupon === "order")) {
      voucherDiscount =
        selectvoucher.find((item) => item.typeCoupon === "order")?.giaTri || 0;
    }
    return (
      cartAfterDiscount +
      shippingFee +
      (typeShip === "express" ? 25000 : 0) -
      (selectvoucher?.find((item) => item.typeCoupon === "order")
        ? voucherDiscount
        : 0)
    );
  }, [
    CartDataAdd,
    phiVanChuyen,
    selectvoucher,
    user.benefits,
    user.value,
    typeShip,
  ]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bone)]/85 text-[var(--color-ink)] flex flex-col">
        {/* 4-node ticket-stub Stepper bar */}
        <div className="border-b-2 border-[var(--color-ink)] bg-[var(--color-paper)] py-4 px-4 sm:px-8">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
                [CASHIER-DESK // CHECKOUT]
              </span>
              <span className="mono-label text-[var(--color-ink-muted)]">
                4-STAGE TICKET VERIFICATION
              </span>
            </div>
            <Stepper
              steps={[
                { id: "01", label: "01 GIAO HÀNG" },
                { id: "02", label: "02 VẬN CHUYỂN" },
                { id: "03", label: "03 THANH TOÁN" },
                { id: "04", label: "04 XÁC NHẬN" },
              ]}
              activeIndex={2}
            />
          </div>
        </div>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-12 gap-8 flex-1 py-8 px-4 sm:px-8"
        >
          <div className="lg:col-span-7 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 md:p-8">
            <CheckOutPanel />
          </div>
          <div className="lg:col-span-5">
            <OrderSummary
              shippingCost=""
              subtotal={subtotal}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </motion.main>
        <Footer />
      </div>
    </>
  );
};
