import { useContext, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Edit,
  File,
  Grid,
  List,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../../contexts/FIlterProduct";
import { CartContext } from "../../../contexts/CartContext";
import { api_Config, UseApiUrl } from "../../../services/api";
import { formatVND } from "../../../utils/formatters";
import type { Product } from "../../../types/type";
import { Toaster } from "../../Toaster";
import { SegmentMeter } from "../../UI/primitives/SegmentMeter";
import ImportExcel from "./ProductManagementComponents/ImportExcel";
import { AdminProductModal } from "./ProductManagementComponents/AdminProductModal";

const CATEGORY_FILTERS = [
  { id: "ALL", label: "Tất cả" },
  { id: "Dress", label: "Dress" },
  { id: "Clothing", label: "Clothing" },
  { id: "Jewelry", label: "Jewelry" },
  { id: "Accessory", label: "Accessory" },
  { id: "Watch", label: "Watch" },
  { id: "LOW_STOCK", label: "Sắp hết hàng (<= 5)" },
];

export default function ProductManagement() {
  const { dataProduct, setDataProduct } = useContext(FilterProductContext);
  const { formatPrice } = useContext(CartContext);
  const formatDisplayPrice = formatPrice ?? formatVND;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [modalState, setModalState] = useState<
    { mode: "add" } | { mode: "edit"; product: Product } | null
  >(null);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return (dataProduct || []).filter((product) => {
      const matchesCategory =
        selectedCategory === "ALL"
          ? true
          : selectedCategory === "LOW_STOCK"
            ? Number(product.stock) <= 5
            : product.type?.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.type?.toLowerCase().includes(query) ||
        product.material?.toLowerCase().includes(query)
      );
    });
  }, [dataProduct, searchTerm, selectedCategory]);

  const lowStockCount = useMemo(
    () => (dataProduct || []).filter((p) => Number(p.stock) <= 5).length,
    [dataProduct],
  );

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const targetId = encodeURIComponent(deleteTarget.id);
      try {
        await axios.delete(
          `${UseApiUrl(api_Config.Product.DeleteProduct)}?productId=${targetId}`,
          { withCredentials: true },
        );
      } catch (primaryErr) {
        if (
          axios.isAxiosError(primaryErr) &&
          (primaryErr.response?.status === 404 ||
            primaryErr.response?.status === 405)
        ) {
          await axios.delete(
            `${UseApiUrl(api_Config.Product.DeleteProductLegacy)}?productId=${targetId}`,
            { withCredentials: true },
          );
        } else {
          throw primaryErr;
        }
      }

      setDataProduct((prev) => {
        const next = prev.filter((item) => item.id !== deleteTarget.id);
        localStorage.setItem("allProducts", JSON.stringify(next));
        return next;
      });
      Toaster.success(`Đã xóa "${deleteTarget.name}" thành công!`);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      Toaster.error("Không thể xóa sản phẩm. Vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bone text-ink p-4 sm:p-8 relative overflow-y-auto">
      {modalState && (
        <AdminProductModal
          mode={modalState.mode}
          initialProduct={modalState.mode === "edit" ? modalState.product : null}
          onClose={() => setModalState(null)}
        />
      )}

      {openImportModal && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <ImportExcel setOpenImportModal={setOpenImportModal} />
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-ink/70 flex items-center justify-center z-50 p-4">
          <div className="bg-paper border-2 border-ink shadow-hard-lg w-full max-w-md p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-danger text-paper border-2 border-ink flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-danger block">
                  [XÁC NHẬN XÓA SẢN PHẨM]
                </span>
                <h2 className="font-display-safe text-xl font-black uppercase text-ink mt-0.5">
                  Xóa &ldquo;{deleteTarget.name}&rdquo;?
                </h2>
                <p className="font-sans text-xs text-ink-muted mt-2">
                  Sản phẩm sẽ bị gỡ khỏi danh mục cửa hàng và bộ sưu tập liên quan. Thao tác này không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 min-h-[44px] px-4 bg-bone text-ink border-2 border-ink font-mono text-xs font-bold uppercase hover:bg-paper cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 min-h-[44px] px-4 bg-danger text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase hover:bg-ink flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div className="bg-paper border-2 border-ink shadow-hard p-6 space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-5 border-b-2 border-ink">
            <div>
              <span className="mono-label text-[10px] text-flash block mb-1">
                [ATELIER INVENTORY // MASTER CATALOG]
              </span>
              <h1 className="font-display-safe text-3xl sm:text-4xl font-black uppercase text-ink">
                Quản Lý Sản Phẩm ({dataProduct?.length ?? 0})
              </h1>
              <p className="font-mono text-xs text-ink-muted mt-1">
                Thêm nhanh, sửa trực tiếp và theo dõi tồn kho toàn thương hiệu.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setModalState({ mode: "add" })}
                className="min-h-[44px] px-5 py-2.5 bg-flash text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-ink transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Thêm Sản Phẩm
              </button>

              <button
                type="button"
                onClick={() => setOpenImportModal(true)}
                className="min-h-[44px] px-5 py-2.5 bg-paper text-ink border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-volt transition-colors cursor-pointer"
              >
                Nhập Excel/JSON <File className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, thương hiệu, loại, chất liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
              />
            </div>

            <div className="flex border-2 border-ink bg-bone self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`min-w-[44px] h-11 px-3 flex items-center justify-center cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-ink text-paper"
                    : "text-ink hover:bg-volt"
                }`}
                aria-label="Chế độ lưới"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`min-w-[44px] h-11 px-3 flex items-center justify-center border-l-2 border-ink cursor-pointer ${
                  viewMode === "list"
                    ? "bg-ink text-paper"
                    : "text-ink hover:bg-volt"
                }`}
                aria-label="Chế độ danh sách"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_FILTERS.map((cat) => {
              const active = selectedCategory === cat.id;
              const badgeCount =
                cat.id === "LOW_STOCK" && lowStockCount > 0 ? lowStockCount : null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[36px] px-3 border-2 border-ink font-mono text-[11px] font-bold uppercase cursor-pointer flex items-center gap-1.5 transition-colors ${
                    active
                      ? "bg-volt text-ink shadow-hard-sm"
                      : "bg-bone text-ink hover:bg-paper"
                  }`}
                >
                  <span>{cat.label}</span>
                  {badgeCount !== null && (
                    <span className="px-1.5 py-0.2 bg-danger text-paper text-[10px]">
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
            <span className="ml-auto font-mono text-[11px] text-ink-muted">
              Hiển thị {filteredProducts.length} / {dataProduct?.length ?? 0} sản phẩm
            </span>
          </div>
        </div>

        <div
          className={`grid gap-6 pb-10 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredProducts.map((p) => {
            const cover = p.thumbnail || p.images?.[0] || "";
            return (
              <div
                key={p.id}
                className={`group relative bg-paper border-2 border-ink shadow-hard flex overflow-hidden ${
                  viewMode === "list"
                    ? "flex-col sm:flex-row"
                    : "flex-col justify-between"
                }`}
              >
                <div
                  className={`relative bg-bone border-ink overflow-hidden shrink-0 ${
                    viewMode === "list"
                      ? "h-56 sm:h-auto sm:w-52 border-b-2 sm:border-b-0 sm:border-r-2"
                      : "h-64 border-b-2"
                  }`}
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-ink-muted">
                      CHƯA CÓ ẢNH
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-ink text-paper font-mono text-[10px] font-bold uppercase">
                    {p.type?.toUpperCase() || "ITEM"}
                  </span>

                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModalState({ mode: "edit", product: p })}
                      className="min-w-[44px] min-h-[44px] p-2 bg-paper border-2 border-ink shadow-hard-sm hover:bg-volt flex items-center justify-center cursor-pointer"
                      aria-label={`Sửa ${p.name}`}
                    >
                      <Edit className="w-4 h-4 text-ink" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(p)}
                      className="min-w-[44px] min-h-[44px] p-2 bg-paper border-2 border-ink shadow-hard-sm text-danger hover:bg-danger hover:text-paper flex items-center justify-center cursor-pointer"
                      aria-label={`Xóa ${p.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold uppercase text-ink-muted">
                        {p.brand || "AURELIA"}
                      </span>
                      {p.season && (
                        <span className="px-1.5 py-0.5 bg-bone border border-ink font-mono text-[9px] font-bold uppercase">
                          {p.season}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display-safe text-lg font-black uppercase leading-snug mb-1 text-ink line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="font-sans text-xs text-ink-muted line-clamp-2 mb-3">
                      {p.description}
                    </p>

                    <div className="flex justify-between items-center pb-3 border-b border-dashed border-ink">
                      <span className="font-mono text-sm font-bold text-ink">
                        {formatDisplayPrice(p.price)}
                      </span>

                      <div className="flex text-flash">
                        {Array.from({ length: Math.round(p.rating || 4) }).map(
                          (_, i) => (
                            <Star key={i} size={13} fill="currentColor" />
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between font-mono text-[11px] font-bold uppercase text-ink mb-1">
                        <span>Tồn kho: {p.stock}</span>
                        <span>Đã bán: {p.sold}</span>
                        {p.discountValue > 0 && (
                          <span className="bg-volt px-1.5 border border-ink text-ink">
                            -{p.discountValue}
                            {p.discountType === "percent" ? "%" : "₫"}
                          </span>
                        )}
                      </div>
                      <SegmentMeter
                        value={Math.min(100, Number(p.stock) || 0)}
                        max={100}
                        segments={10}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setModalState({ mode: "edit", product: p })}
                        className="min-h-[44px] px-3 bg-volt text-ink border-2 border-ink font-mono text-xs font-bold uppercase hover:bg-paper transition-colors cursor-pointer"
                      >
                        Sửa nhanh
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/Fashion/Products/${p.id}`)}
                        className="flex-1 min-h-[44px] px-4 py-2.5 bg-ink text-paper border-2 border-ink font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-flash transition-colors cursor-pointer"
                      >
                        Xem chi tiết <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setModalState({ mode: "add" })}
            className="min-h-[380px] bg-paper border-2 border-dashed border-ink hover:bg-volt/20 transition-colors flex flex-col items-center justify-center gap-4 p-6 cursor-pointer"
          >
            <div className="w-16 h-16 bg-ink text-paper border-2 border-ink shadow-hard-sm flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="font-display-safe text-xl font-black uppercase text-ink">
              Thêm Sản Phẩm
            </h3>
            <p className="font-mono text-xs text-ink-muted">
              Tạo sản phẩm mới cho gian hàng
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
