import { AnimatePresence, motion } from "framer-motion";
import { X, Edit3, Save } from "lucide-react";
import { AdminContext } from "../../../../contexts/AdminContext";
import React, { useContext } from "react";

export const EditCoupon = ({
  editing,
  setEditing,
}: {
  editing: Record<string, string | number | boolean | undefined> | null;
  setEditing: React.Dispatch<React.SetStateAction<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
}) => {
  const { handleUpdateCoupon } = useContext(AdminContext);
  const handleClick = () => {
    handleUpdateCoupon(editing);
    setEditing(null);
  };
  return (
    <AnimatePresence>
      {editing && (
        <motion.div
          className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEditing(null)}
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
                <Edit3 className="text-volt" size={22} />
                Chỉnh Sửa Mã Giảm Giá
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="min-w-[44px] min-h-[44px] bg-paper text-ink border-2 border-ink flex items-center justify-center hover:bg-flash hover:text-paper transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Mã giảm giá
                  </label>
                  <input
                    value={editing.code ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, code: e.target.value })
                    }
                    className="w-full h-12 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                    Giá trị
                  </label>
                  <input
                    type="number"
                    value={editing.GiaTri ?? editing.giaTri ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, GiaTri: Number(e.target.value) })
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
                    value={editing.TheLoaiApDung ?? editing.loaiGiam ?? "Phần trăm"}
                    onChange={(e) =>
                      setEditing({ ...editing, TheLoaiApDung: e.target.value })
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
                    value={editing.SoLuong ?? editing.soLuong ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        SoLuong: Number(e.target.value),
                      })
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
                  value={editing.PhamViApDung ?? editing.phamViApDung ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, PhamViApDung: e.target.value })
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
                    value={editing.DieuKienApDung ?? editing.dieuKienApDung ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, DieuKienApDung: e.target.value })
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
                    value={editing.Apdungcho ?? editing.apDungCho ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, Apdungcho: e.target.value })
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
                    value={editing.NgayBatDau ?? editing.ngayBatDau ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, NgayBatDau: e.target.value })
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
                    value={editing.NgayKetThuc ?? editing.ngayKetThuc ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, NgayKetThuc: e.target.value })
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
                  value={editing.Reuse ?? editing.reuse ?? "Một lần"}
                  onChange={(e) =>
                    setEditing({ ...editing, Reuse: e.target.value })
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
                  id="editActive"
                  checked={Boolean(editing.isActive)}
                  onChange={(e) =>
                    setEditing({ ...editing, isActive: e.target.checked })
                  }
                  className="w-5 h-5 accent-ink border-2 border-ink"
                />
                <label
                  htmlFor="editActive"
                  className="font-mono text-xs font-bold uppercase text-ink cursor-pointer"
                >
                  Mã đang hoạt động
                </label>
              </div>

              <div className="pt-6 border-t-2 border-ink flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="min-h-[44px] px-6 py-2.5 bg-bone border-2 border-ink text-ink font-mono text-xs font-bold uppercase hover:bg-fog transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleClick}
                  className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 bg-flash border-2 border-ink text-paper shadow-hard-sm font-mono text-xs font-bold uppercase hover:bg-ink transition-colors cursor-pointer"
                >
                  <Save size={16} />
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
