import React from "react";
import type { Coupon } from "../../../../types/type";
import { CouponCard } from "./CouponCard";

export const Section: React.FC<{
  title: string;
  icon: React.ElementType;
  coupons: Coupon[];
  type: string;
  emptyText: string;
}> = ({
  title,
  icon: Icon,
  coupons = [],
  type,
  emptyText,
}) => {
  const safeCoupons = Array.isArray(coupons) ? coupons : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-rule/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-ink-muted" />
          <h2 className="font-heading text-sm font-semibold text-ink">
            {title}
          </h2>
        </div>
        <span className="font-mono text-xs text-ink-muted">
          {safeCoupons.length} phiếu
        </span>
      </div>

      {safeCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} type={type} />
          ))}
        </div>
      ) : (
        <div className="bg-paper border border-dashed border-rule rounded-tag p-8 text-center text-xs font-mono text-ink-muted">
          {emptyText}
        </div>
      )}
    </div>
  );
};

