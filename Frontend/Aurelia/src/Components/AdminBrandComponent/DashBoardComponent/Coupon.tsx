import { useContext, useState } from "react";
import {
  Plus,
  Tag,
  TicketPercent,
  Package,
  RefreshCw,
  CheckCircle,
  Search,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { AdminContext } from "../../../contexts/AdminContext";
import { AddCoupon } from "./CouponComponent/AddCoupon";
import { EditCoupon } from "./CouponComponent/EditCoupon";
import { v4 as uuid } from "uuid";
import { CouponTable } from "./CouponTable";
import { SplitFlap } from "../../UI/primitives/SplitFlap";
import type { Coupon as CouponType } from "../../../types/type";

export default function Coupon() {
  const { coupons, handleDeleteCoupon, handleToggleCouponStatus } =
    useContext(AdminContext);
  const [editing, setEditing] = useState<CouponType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  const [newCoupon, setNewCoupon] = useState({
    id: uuid(),
    code: "",
    NgayBatDau: "",
    NgayKetThuc: "",
    PhamViApDung: "",
    GiaTri: "",
    DieuKienApDung: "",
    ApDungCho: "",
    TheLoaiApDung: "Phần trăm",
    isActive: true,
    SoLuong: "",
    Reuse: "Một lần",
  });

  const handleDelete = (couponId: string) => {
    handleDeleteCoupon(couponId);
  };
  const handleToggleStatus = (couponId: string, bool: boolean) => {
    handleToggleCouponStatus(couponId, bool);
  };
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && coupon.isActive) ||
      (filterActive === "inactive" && !coupon.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen overflow-y-auto bg-bone p-4 md:p-8 space-y-6">
      <header className="bg-paper border-2 border-ink shadow-hard p-6 flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <span className="mono-label text-[10px] text-flash block mb-1">
            [TICKET BOOTH // VOUCHER LEDGER]
          </span>
          <h1 className="font-display-safe text-3xl md:text-4xl font-black uppercase text-ink">
            Quản Lý Mã Giảm Giá
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Tạo và theo dõi các chương trình khuyến mãi của hệ thống
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="min-h-[44px] flex items-center gap-2 px-6 py-3 bg-flash text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink transition-colors self-start lg:self-auto cursor-pointer"
        >
          <Plus size={18} />
          Thêm Mã Mới
        </button>
      </header>

      <div className="bg-paper border-2 border-ink shadow-hard p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilterActive("all")}
              className={`min-h-[44px] px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-ink transition-colors cursor-pointer ${
                filterActive === "all"
                  ? "bg-ink text-paper"
                  : "bg-bone text-ink hover:bg-volt"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterActive("active")}
              className={`min-h-[44px] px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-ink transition-colors cursor-pointer ${
                filterActive === "active"
                  ? "bg-ink text-paper"
                  : "bg-bone text-ink hover:bg-volt"
              }`}
            >
              Hoạt động
            </button>
            <button
              type="button"
              onClick={() => setFilterActive("inactive")}
              className={`min-h-[44px] px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-ink transition-colors cursor-pointer ${
                filterActive === "inactive"
                  ? "bg-ink text-paper"
                  : "bg-bone text-ink hover:bg-volt"
              }`}
            >
              Ngưng
            </button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-paper border-2 border-ink shadow-hard p-5">
          <div className="flex justify-between items-start mb-3">
            <p className="font-mono text-xs font-bold uppercase text-ink-muted">
              Tổng mã
            </p>
            <Tag className="text-ink" size={20} />
          </div>
          <SplitFlap value={String(coupons.length)} size="md" />
        </div>

        <div className="bg-paper border-2 border-ink shadow-hard p-5">
          <div className="flex justify-between items-start mb-3">
            <p className="font-mono text-xs font-bold uppercase text-ink-muted">
              Đang hoạt động
            </p>
            <CheckCircle className="text-success" size={20} />
          </div>
          <SplitFlap
            value={String(coupons.filter((c) => c.isActive).length)}
            size="md"
          />
        </div>

        <div className="bg-paper border-2 border-ink shadow-hard p-5">
          <div className="flex justify-between items-start mb-3">
            <p className="font-mono text-xs font-bold uppercase text-ink-muted">
              Tổng số lượng
            </p>
            <Package className="text-ink" size={20} />
          </div>
          <SplitFlap
            value={String(coupons.reduce((sum, c) => sum + c.soLuong, 0))}
            size="md"
          />
        </div>

        <div className="bg-paper border-2 border-ink shadow-hard p-5">
          <div className="flex justify-between items-start mb-3">
            <p className="font-mono text-xs font-bold uppercase text-ink-muted">
              Tái sử dụng
            </p>
            <RefreshCw className="text-flash" size={20} />
          </div>
          <SplitFlap
            value={String(
              coupons.filter((c) => c.reuse === "Nhiều lần").length,
            )}
            size="md"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredCoupons.map((coupon, i) => (
            <CouponTable
              key={coupon.id}
              coupon={coupon}
              i={i}
              handleDelete={handleDelete}
              setEditing={setEditing}
              handleToggleStatus={handleToggleStatus}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredCoupons.length === 0 && (
        <div className="bg-paper border-2 border-dashed border-ink text-center py-16">
          <TicketPercent size={48} className="text-ink-muted mx-auto mb-3" />
          <p className="font-mono text-sm font-bold uppercase text-ink-muted">
            Không tìm thấy mã giảm giá nào
          </p>
        </div>
      )}

      <div>
        <AddCoupon
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newCoupon={newCoupon}
          setNewCoupon={setNewCoupon}
        />
      </div>

      <div>
        <EditCoupon editing={editing} setEditing={setEditing} />
      </div>
    </div>
  );
}
