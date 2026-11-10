import React, { useContext, useEffect, useState } from "react";
import { X, Sparkles, Tag } from "lucide-react";
import { AdminContext } from "../contexts/AdminContext";
import type { Cart, order } from "../types/type";
import { CouponCard } from "./CheckOutComponents/CouponCard";

export const ListCoupon = ({
  isOpen,
  setIsOpen,
  dataOrder,
  order,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataOrder: Cart[];
  order: order | undefined;
}) => {
  const { coupons, suggestVoucher} =
    useContext(AdminContext);

  const [validationMessage] = useState<string | null>(null);

  useEffect(() => {
    suggestVoucher(order ?? undefined);
  }, [dataOrder, order]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl
      max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl
      border border-slate-400/40"
      >
        <div className="relative bg-gradient-to-r from-gray-300 to-gray-500 p-8">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-slate-800 hover:bg-black/10 rounded-xl p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-gray-300">
              <Sparkles className="w-10 h-10 text-slate-800" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Mã giảm giá</h2>
              <p className="text-slate-700 text-lg">Tiết kiệm ngay hôm nay</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(92vh-150px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {validationMessage && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 text-sm sm:text-base">
              {validationMessage}
            </div>
          )}

          {coupons.length === 0 ? (
            <div className="text-center py-10 sm:py-12">
              <Tag className="w-14 h-14 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-base sm:text-lg">
                Chưa có mã giảm giá nào
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white px-1 sm:px-3 pb-3">
                  Mã Giảm Phí Ship
                </h1>
                <CouponCard
                  type="ship"
                />
              </div>

              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white px-1 sm:px-3 pb-3">
                  Mã Giảm Đơn Hàng
                </h1>
                <CouponCard
                  type="order"

                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
