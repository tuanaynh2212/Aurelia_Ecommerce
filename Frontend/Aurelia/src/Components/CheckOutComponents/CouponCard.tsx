import { useContext, useState } from "react";
import type { Coupon } from "../../types/type";
import { Copy, Check, Percent, TruckIcon, Zap } from "lucide-react";
import { AdminContext } from "../../contexts/AdminContext";
import { Toaster } from "../Toaster";

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

  const formatValue = (value: number, type: string) => {
    if (type === "percent") return `${value}%`;
    if (type === "money") return `${(value / 1000).toFixed(0)}K`;
    return "Free";
  };

  const getIcon = (type: string) => {
    if (type === "order") return <Percent className="w-5 h-5" />;
    if (type === "ship") return <TruckIcon className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
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
    <div className="space-y-5">
      {coupons
        .filter((c: Coupon) => c.isActive && c.typeCoupon === type)
        .map((coupon) => (
          <div
            key={coupon.id}
            className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-400/40 p-4 md:p-6
              shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]"
          >
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-gray-200 to-gray-400 text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {coupon.reuse === "Nhiều lần" ? "REUSE" : "HOT"}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">

              <div className="bg-gradient-to-br from-gray-300 to-gray-500 text-white p-5 rounded-2xl shadow-xl min-w-[110px] flex flex-col items-center">
                {getIcon(coupon.typeCoupon ?? "")}
                <div className="text-3xl font-black mt-1">
                  {formatValue(coupon.giaTri!, coupon.loaiGiam)}
                </div>
                <div className="text-xs opacity-80">
                  {coupon.typeCoupon === "order" ? "OFF" : "FREE"}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white/80 border border-slate-300 px-4 py-2 rounded-xl">
                    <code className="font-bold text-slate-800">{coupon.code}</code>
                  </div>

                  <button
                    onClick={() => copyCode(coupon.code, coupon.id)}
                    className="text-slate-700 hover:text-slate-900 p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    {copiedCode === coupon.id ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-slate-700">{coupon.dieuKienApDung}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/70 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-sm">
                    {coupon.moTa ?? "Không mô tả"}
                  </span>

                  <span className="bg-white/70 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-sm">
                    HSD: {formatDate(coupon.ngayKetThuc)}
                  </span>

                  {coupon.soLuong > 0 && (
                    <span className="bg-white/70 border border-slate-300 text-yellow-700 px-3 py-1.5 rounded-lg text-sm">
                      Còn: {coupon.soLuong}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 min-w-[140px]">
                <button
                  onClick={() => applyCoupon(coupon)}
                  disabled={!dataVoucher.find((v) => v.code === coupon.code)}
                  className={`px-6 py-3 rounded-xl font-bold w-full shadow-lg transition
                    ${
                      dataVoucher.find((v) => v.code === coupon.code)
                        ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:scale-105"
                        : "bg-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {selectvoucher.find((s) => s.id === coupon.id)
                    ? "Đã áp dụng"
                    : dataVoucher.find((v) => v.code === coupon.code)
                    ? "Áp dụng"
                    : "Không thể áp dụng"}
                </button>

                {selectvoucher.find((s) => s.id === coupon.id) && (
                  <button
                    onClick={() => removeCoupon(coupon.id)}
                    className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold w-full"
                  >
                    Bỏ áp dụng
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
