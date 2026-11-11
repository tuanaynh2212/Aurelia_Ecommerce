import { useContext, useState } from "react";
import type { Coupon } from "../../types/type";
import { Copy, Check, Percent, TruckIcon, Zap } from "lucide-react";
import { AdminContext } from "../../contexts/AdminContext";
import { Toaster } from "../Toaster";
import { Ticket } from "../UI";

export const CouponCard = ({
  type,
}: {
  type: "order" | "ship";
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { coupons, dataVoucher, selectvoucher, setSelectvoucher } =
    useContext(AdminContext);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatValue = (value: number, discountType: string) => {
    if (discountType === "percent") return `${value}%`;
    if (discountType === "money") return `${(value / 1000).toFixed(0)}K`;
    return "Free";
  };

  const getIcon = (couponType: string) => {
    if (couponType === "order") return <Percent className="w-4 h-4" />;
    if (couponType === "ship") return <TruckIcon className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const applyCoupon = (coupon: Coupon) => {
    const hasOrder = selectvoucher?.find((a) => a.typeCoupon === "order");
    const hasShip = selectvoucher?.find((a) => a.typeCoupon === "ship");

    if (coupon.typeCoupon === "order" && hasOrder) {
      alert("Chỉ được áp dụng 1 mã giảm giá đơn hàng");
      return;
    }
    if (coupon.typeCoupon === "ship" && hasShip) {
      alert("Chỉ được áp dụng 1 mã giảm phí ship");
      return;
    }

    setSelectvoucher((prev) => [...prev, coupon]);
    Toaster.success("Áp dụng mã giảm giá thành công");
  };

  const removeCoupon = (id: string) => {
    setSelectvoucher((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      {coupons
        .filter((c: Coupon) => c.isActive && c.typeCoupon === type)
        .map((coupon) => {
          const isSelected = Boolean(
            selectvoucher.find((s) => s.id === coupon.id),
          );
          const isEligible = Boolean(
            dataVoucher.find((v) => v.code === coupon.code),
          );
          return (
            <Ticket
              key={coupon.id}
              serial={coupon.code}
              header={coupon.reuse === "Nhiều lần" ? "REUSE TICKET" : "HOT VOUCHER"}
              stampText={isSelected ? "APPLIED" : undefined}
              stub={
                <div className="flex flex-col items-center gap-2 min-w-[130px]">
                  <button
                    type="button"
                    onClick={() => applyCoupon(coupon)}
                    disabled={!isEligible}
                    className={`min-h-[44px] px-4 py-2 border-2 border-[var(--color-ink)] mono-label w-full transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--color-volt)] text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]"
                        : isEligible
                        ? "bg-[var(--color-flash)] text-[var(--color-paper)] shadow-[var(--shadow-hard-sm)]"
                        : "bg-[var(--color-fog)] text-[var(--color-ink-muted)] cursor-not-allowed"
                    }`}
                  >
                    {isSelected
                      ? "ĐÃ ÁP DỤNG"
                      : isEligible
                      ? "ÁP DỤNG"
                      : "KHÔNG HỢP LỆ"}
                  </button>

                  {isSelected && (
                    <button
                      type="button"
                      onClick={() => removeCoupon(coupon.id)}
                      className="min-h-[40px] px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-danger)] text-[var(--color-paper)] mono-label w-full cursor-pointer"
                    >
                      BỎ ÁP DỤNG
                    </button>
                  )}
                </div>
              }
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] p-3.5 min-w-[96px] flex flex-col items-center justify-center">
                  {getIcon(coupon.typeCoupon ?? "")}
                  <div className="text-2xl font-mono font-extrabold text-[var(--color-volt)] mt-1 tabular-nums">
                    {formatValue(coupon.giaTri!, coupon.loaiGiam)}
                  </div>
                  <div className="mono-label text-[var(--color-paper)] text-[10px]">
                    {coupon.typeCoupon === "order" ? "ORDER OFF" : "SHIP FREE"}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="border-2 border-[var(--color-ink)] bg-[var(--color-bone)] px-3 py-1">
                      <code className="font-mono font-extrabold text-xs text-[var(--color-ink)]">
                        {coupon.code}
                      </code>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyCode(coupon.code, coupon.id)}
                      className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] transition-colors cursor-pointer"
                      aria-label="Sao chép mã"
                    >
                      {copiedCode === coupon.id ? (
                        <Check className="w-4 h-4 text-[var(--color-success)]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[var(--color-ink)]" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs font-sans font-bold text-[var(--color-ink)]">
                    {coupon.dieuKienApDung}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="border border-[var(--color-ink)] bg-[var(--color-bone)] px-2 py-0.5 mono-label text-[10px] text-[var(--color-ink-muted)]">
                      {coupon.moTa ?? "Không mô tả"}
                    </span>
                    <span className="border border-[var(--color-ink)] bg-[var(--color-bone)] px-2 py-0.5 mono-label text-[10px] text-[var(--color-ink-muted)]">
                      HSD: {formatDate(coupon.ngayKetThuc)}
                    </span>
                    {coupon.soLuong > 0 && (
                      <span className="border border-[var(--color-ink)] bg-[var(--color-volt)] px-2 py-0.5 mono-label text-[10px] text-[var(--color-ink)]">
                        CÒN: {coupon.soLuong}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Ticket>
          );
        })}
    </div>
  );
};

export default CouponCard;
