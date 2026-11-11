import { AnimatePresence, motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import React, { useContext } from "react";
import { AdminContext } from "../../../../contexts/AdminContext";

interface NewCouponForm {
  id: string;
  code: string;
  NgayBatDau: string;
  NgayKetThuc: string;
  PhamViApDung: string;
  GiaTri: string | number;
  DieuKienApDung: string;
  ApDungCho?: string;
  Apdungcho?: string;
  TheLoaiApDung: string;
  isActive: boolean;
  SoLuong: string | number;
  Reuse: string;
}

export const AddCoupon = ({
  showAddModal,
  setShowAddModal,
  newCoupon,
  setNewCoupon,
}: {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  newCoupon: NewCouponForm;
  setNewCoupon: React.Dispatch<React.SetStateAction<NewCouponForm>>;
}) => {
  const { handleAddCoupon } = useContext(AdminContext);
  const handleCLick = () => {
    handleAddCoupon(newCoupon);
    setShowAddModal(false);
  };
  return (
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-paper border-2 border-ink shadow-hard-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-ink text-paper px-6 py-4 flex items-center justify-between border-b-2 border-ink">
              <h2 className="font-display-safe text-xl font-black uppercase flex items-center gap-2">
                <Plus className="text-volt" size={22} />
                Tạo Mã Giảm Giá Mới
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="min-w-[44px] min-h-[44px] bg-paper text-ink border-2 border-ink flex items-center justify-center hover:bg-flash hover:text-paper transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Mã giảm giá *
                  </label>
                  <input
                    placeholder="VD: SALE50"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Giá trị *
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 20 hoặc 50000"
                    value={newCoupon.GiaTri}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, GiaTri: e.target.value })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Thể loại áp dụng
                  </label>
                  <select
                    value={newCoupon.TheLoaiApDung}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        TheLoaiApDung: e.target.value,
                      })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  >
                    <option>Phần trăm</option>
                    <option>Cố định</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 100"
                    value={newCoupon.SoLuong}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, SoLuong: e.target.value })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                  Phạm vi áp dụng
                </label>
                <input
                  placeholder="VD: Toàn bộ sản phẩm, Đơn hàng trên 500k..."
                  value={newCoupon.PhamViApDung}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, PhamViApDung: e.target.value })
                  }
                  className="w-full h-12 px-3 bg-bone border-2 border-ink font-sans text-sm text-ink focus:bg-paper outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Điều kiện áp dụng
                  </label>
                  <input
                    placeholder="VD: Áp dụng cho đơn hàng từ 500k trở lên"
                    value={newCoupon.DieuKienApDung}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        DieuKienApDung: e.target.value,
                      })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-sans text-sm text-ink focus:bg-paper outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Áp dụng cho
                  </label>
                  <input
                    placeholder="VD: Tất cả khách hàng, Khách hàng mới..."
                    value={newCoupon.Apdungcho ?? ""}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, Apdungcho: e.target.value })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-sans text-sm text-ink focus:bg-paper outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={newCoupon.NgayBatDau}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, NgayBatDau: e.target.value })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={newCoupon.NgayKetThuc}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        NgayKetThuc: e.target.value,
                      })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                  Tái sử dụng
                </label>
                <select
                  value={newCoupon.Reuse}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, Reuse: e.target.value })
                  }
                  className="w-full h-12 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                >
                  <option>Một lần</option>
                  <option>Nhiều lần</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newCoupon.isActive}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, isActive: e.target.checked })
                  }
                  className="w-5 h-5 accent-ink border-2 border-ink"
                />
                <label
                  htmlFor="isActive"
                  className="font-mono text-xs font-bold uppercase text-ink cursor-pointer"
                >
                  Kích hoạt ngay sau khi tạo
                </label>
              </div>

              <div className="pt-6 border-t-2 border-ink flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] px-6 py-2.5 bg-bone border-2 border-ink text-ink font-mono text-xs font-bold uppercase hover:bg-fog transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleCLick}
                  className="min-h-[44px] px-6 py-2.5 bg-flash border-2 border-ink text-paper shadow-hard-sm font-mono text-xs font-bold uppercase hover:bg-ink transition-colors cursor-pointer"
                >
                  Tạo Mã
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
