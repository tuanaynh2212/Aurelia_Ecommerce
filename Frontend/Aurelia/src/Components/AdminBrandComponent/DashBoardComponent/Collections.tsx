import { useContext, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Star,
  Shirt,
  ArrowRight,
  Grid,
  List,
  AlertTriangle,
} from "lucide-react";
import { CollectionContext } from "../../../contexts/SeasonContext";
import { useNavigate } from "react-router-dom";
import AddCollectionForm from "./CollectionComponent/AddCollectionForm";
import { SplitFlap } from "../../UI/primitives/SplitFlap";
import type { Season } from "../../../types/type";

export default function Collections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeAddCollection, setActiveAddCollection] = useState(false);
  const [status, setStatus] = useState<string>("Add");
  const [dataEdit, setDataEdit] = useState<Season | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Season | null>(null);

  const { collectionData, statCollection, handleDeleteCollection } =
    useContext(CollectionContext);

  const navigate = useNavigate();

  const filteredCollections = useMemo(
    () =>
      (collectionData || []).filter((collection) => {
        const matchesSearch =
          collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collection.slogan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collection.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && collection.active) ||
          (statusFilter === "hidden" && !collection.active);
        return matchesSearch && matchesStatus;
      }),
    [collectionData, searchTerm, statusFilter]
  );

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteCollection(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-bone text-ink p-4 md:p-8 relative">
      {activeAddCollection && (
        <div className="fixed inset-0 bg-ink/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <AddCollectionForm
            status={status}
            season={dataEdit}
            setState={setActiveAddCollection}
          />
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-ink/65 flex items-center justify-center z-50 p-4">
          <div className="bg-paper border-2 border-ink shadow-hard-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-volt border-2 border-ink flex items-center justify-center text-flash shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-display-safe text-lg font-black uppercase text-ink">
                  Xác nhận xóa bộ sưu tập
                </h3>
                <p className="font-mono text-xs text-ink-muted">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <p className="font-sans text-sm text-ink bg-bone border-2 border-ink p-3">
              Bạn chắc chắn muốn xóa bộ sưu tập{" "}
              <strong className="uppercase">{deleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="min-h-[42px] px-4 border-2 border-ink bg-bone font-mono text-xs font-bold uppercase cursor-pointer hover:bg-fog"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDelete()}
                className="min-h-[42px] px-5 border-2 border-ink bg-flash text-paper font-mono text-xs font-bold uppercase shadow-hard-sm cursor-pointer hover:bg-ink"
              >
                Xóa bộ sưu tập
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto space-y-6">
        <div className="bg-paper border-2 border-ink shadow-hard p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 pb-6 mb-6 border-b-2 border-ink">
            <div>
              <span className="mono-label text-[10px] text-flash block mb-1">
                [ARCHIVE // SEASONAL DOSSIERS]
              </span>
              <h1 className="font-display-safe text-3xl sm:text-4xl font-black uppercase text-ink">
                Bộ Sưu Tập Theo Mùa
              </h1>
              <p className="font-mono text-xs text-ink-muted mt-1">
                Quản lý bộ sưu tập, gán sản phẩm trình diễn và cập nhật hình ảnh nhanh chóng.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setStatus("Add");
                setDataEdit(null);
                setActiveAddCollection(true);
              }}
              className="min-h-[44px] px-6 py-3 bg-flash text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tạo Bộ Sưu Tập
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Bộ sưu tập",
                value: statCollection?.totalCollection || collectionData?.length || 0,
                icon: Package,
              },
              {
                label: "Sản phẩm gán",
                value: statCollection?.totalProduct || 0,
                icon: Shirt,
              },
              {
                label: "Đánh giá TB",
                value: statCollection?.totalRating || 0,
                icon: Star,
              },
              {
                label: "Lượt xem",
                value: statCollection?.totalViews || 0,
                icon: Eye,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-bone border-2 border-ink p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    {s.label}
                  </span>
                  <div className="w-8 h-8 bg-ink text-paper flex justify-center items-center">
                    <s.icon className="w-4 h-4" />
                  </div>
                </div>
                <SplitFlap value={String(s.value)} size="sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-paper border-2 border-ink shadow-hard p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted w-4 h-4" />
              <input
                type="text"
                className="w-full h-12 pl-10 pr-4 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper focus:outline-none"
                placeholder="Tìm theo tên bộ sưu tập, slogan, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex border-2 border-ink bg-bone">
              {[
                { key: "all" as const, label: "Tất cả" },
                { key: "active" as const, label: "Đang bật" },
                { key: "hidden" as const, label: "Tạm ẩn" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`min-h-[44px] px-3 font-mono text-[11px] font-bold uppercase cursor-pointer border-r border-ink last:border-r-0 ${
                    statusFilter === tab.key
                      ? "bg-volt text-ink"
                      : "text-ink hover:bg-fog"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex border-2 border-ink bg-bone">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`min-w-[44px] h-11 px-3 flex items-center justify-center cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-ink text-paper"
                    : "text-ink hover:bg-volt"
                }`}
                aria-label="Grid view"
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
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="group relative bg-paper border-2 border-ink shadow-hard overflow-hidden flex flex-col justify-between"
            >
              <div className="h-64 relative border-b-2 border-ink bg-bone overflow-hidden">
                {collection.banner ? (
                  <img
                    src={collection.banner}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="studio-grid-bg w-full h-full" />
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-ink text-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    {collection.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 border border-ink font-mono text-[10px] font-bold uppercase ${
                      collection.active ? "bg-volt text-ink" : "bg-fog text-ink-muted"
                    }`}
                  >
                    {collection.active ? "ĐANG BẬT" : "TẠM ẨN"}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 bg-paper/95 border border-ink px-2 py-0.5 font-mono text-[10px] font-bold">
                  {collection.products?.length || 0} sản phẩm
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("edit");
                      setDataEdit(collection);
                      setActiveAddCollection(true);
                    }}
                    className="min-w-[44px] min-h-[44px] p-2 bg-paper border-2 border-ink shadow-hard-sm hover:bg-volt flex items-center justify-center cursor-pointer"
                    aria-label={`Chỉnh sửa ${collection.name}`}
                  >
                    <Edit className="w-4 h-4 text-ink" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(collection)}
                    className="min-w-[44px] min-h-[44px] p-2 bg-paper border-2 border-ink shadow-hard-sm hover:bg-danger hover:text-paper text-danger flex items-center justify-center cursor-pointer"
                    aria-label={`Xóa ${collection.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                    {collection.slug || collection.name}
                  </span>
                  <h3 className="font-display-safe text-xl font-black uppercase text-ink mt-1 mb-2">
                    {collection.slogan || collection.name}
                  </h3>
                  <p className="font-sans text-xs text-ink-muted line-clamp-2 mb-4">
                    {collection.description || "Chưa có mô tả chi tiết."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/Collection/${collection.id}`)}
                  className="w-full min-h-[44px] py-2.5 bg-ink text-paper border-2 border-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-flash transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Xem Trang Bộ Sưu Tập <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="min-h-[340px] bg-paper border-2 border-dashed border-ink flex flex-col justify-center items-center cursor-pointer hover:bg-volt/20 transition-colors p-6"
            onClick={() => {
              setStatus("Add");
              setDataEdit(null);
              setActiveAddCollection(true);
            }}
          >
            <div className="w-14 h-14 bg-ink text-paper border-2 border-ink shadow-hard-sm flex justify-center items-center">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="mt-4 font-display-safe text-lg font-black uppercase text-ink">
              Tạo Bộ Sưu Tập Mới
            </h3>
            <p className="font-mono text-xs text-ink-muted mt-1">
              Thêm mùa mới & chọn sản phẩm
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
