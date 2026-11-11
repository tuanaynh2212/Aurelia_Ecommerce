import {
  Check,
  ImagePlus,
  Layers,
  Loader2,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FilterProductContext } from "../../../../contexts/FIlterProduct";
import { CollectionContext } from "../../../../contexts/SeasonContext";
import { v4 as uuid } from "uuid";
import type { Product, ProductRef, Season } from "../../../../types/type";
import { toVietnameseSlug, uploadImageToImgbb } from "../adminUpload";
import { formatVND } from "../../../../utils/formatters";
import { getPrimaryProductImage } from "../../../../utils/productHelpers";
import { Toaster } from "../../../Toaster";

const COLOR_SUGGESTIONS = ["Đen", "Trắng Kem", "Be", "Xanh Olive", "Đỏ Cam", "Nâu Đất"];
const MATERIAL_SUGGESTIONS = ["Linen", "Silk", "Cotton", "Tweed", "Wool", "Denim"];
const MOOD_SUGGESTIONS = ["Tối giản", "Sang trọng", "Phóng khoáng", "Cổ điển"];
const TEMP_SUGGESTIONS = ["Xuân nhẹ", "Hè nắng", "Thu mát", "Đông ấm"];

function extractProductIds(refs: Array<ProductRef | string> | undefined): string[] {
  if (!Array.isArray(refs)) return [];
  return refs
    .map((item) => (typeof item === "string" ? item : item?.id))
    .filter((id): id is string => Boolean(id));
}

export default function AddCollectionForm({
  setState,
  status,
  season,
}: {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  status: string;
  season?: Season | null;
}) {
  const isEditMode = status === "edit" && Boolean(season);
  const { handleAddCollection, handleUpdateCollection } =
    useContext(CollectionContext);
  const { dataProduct } = useContext(FilterProductContext);

  const [text, setText] = useState("");
  const [filteredSeason, setFilteredSeason] = useState("");
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialProductIds = useMemo(
    () => (isEditMode ? extractProductIds(season?.products) : []),
    [isEditMode, season?.products]
  );

  const [selectedProducts, setSelectedProducts] = useState<Product[]>(() => {
    if (!isEditMode || !Array.isArray(dataProduct)) return [];
    const idSet = new Set(initialProductIds);
    return dataProduct.filter((p) => idSet.has(p.id));
  });

  useEffect(() => {
    if (!isEditMode || !Array.isArray(dataProduct)) return;
    const idSet = new Set(initialProductIds);
    setSelectedProducts((prev) =>
      prev.length > 0 ? prev : dataProduct.filter((p) => idSet.has(p.id))
    );
  }, [isEditMode, dataProduct, initialProductIds]);

  const [form, setForm] = useState({
    id: isEditMode && season ? season.id : uuid(),
    slug: isEditMode && season ? season.slug : "",
    name: isEditMode && season ? season.name : "",
    slogan: isEditMode && season ? season.slogan : "",
    description: isEditMode && season ? season.description : "",
    banner: isEditMode && season ? season.banner : "",
    seasonalAttributes:
      isEditMode && season && season.seasonalAttributes
        ? {
            colors: season.seasonalAttributes.colors || [],
            materials: season.seasonalAttributes.materials || [],
            mood: season.seasonalAttributes.mood || "",
            temperature: season.seasonalAttributes.temperature || "",
          }
        : {
            colors: [] as string[],
            materials: [] as string[],
            mood: "",
            temperature: "",
          },
    products:
      isEditMode && season
        ? season.products || []
        : ([] as Array<ProductRef | string>),
    active: isEditMode && season ? season.active : true,
    rate: isEditMode && season ? season.rate : 0,
    views: isEditMode && season ? season.views : 0,
  });

  const selectedIdSet = useMemo(
    () => new Set(selectedProducts.map((p) => p.id)),
    [selectedProducts]
  );

  const filteredList = useMemo(
    () =>
      (dataProduct || []).filter((product) => {
        const matchName =
          product.name?.toLowerCase().includes(text.toLowerCase()) ||
          product.brand?.toLowerCase().includes(text.toLowerCase());
        const matchSeason = !filteredSeason || product.season === filteredSeason;
        return matchName && matchSeason;
      }),
    [dataProduct, text, filteredSeason]
  );

  const syncSelectedProducts = (nextProducts: Product[]) => {
    setSelectedProducts(nextProducts);
    setForm((prev) => ({
      ...prev,
      products: nextProducts.map((p) => ({ id: p.id })),
    }));
  };

  const handleToggleProduct = (product: Product) => {
    if (selectedIdSet.has(product.id)) {
      syncSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      syncSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleSelectAllFiltered = () => {
    const merged = new Map<string, Product>();
    selectedProducts.forEach((p) => merged.set(p.id, p));
    filteredList.forEach((p) => merged.set(p.id, p));
    syncSelectedProducts(Array.from(merged.values()));
  };

  const clearAll = () => syncSelectedProducts([]);

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: !slugTouched ? toVietnameseSlug(value) : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "slug") setSlugTouched(true);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttrChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({
      ...prev,
      seasonalAttributes: { ...prev.seasonalAttributes, [field]: value },
    }));
  };

  const toggleChipAttr = (field: "colors" | "materials", chip: string) => {
    const current = form.seasonalAttributes[field] || [];
    const exists = current.includes(chip);
    const next = exists
      ? current.filter((item) => item !== chip)
      : [...current, chip];
    handleAttrChange(field, next);
  };

  const handleUploadBanner = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToImgbb(file);
      setForm((prev) => ({ ...prev, banner: url }));
      Toaster.success("Tải ảnh banner thành công!");
    } catch (err) {
      console.error(err);
      Toaster.error("Tải ảnh thất bại, thử dán URL trực tiếp.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Toaster.error("Vui lòng nhập tên bộ sưu tập / mùa");
      return;
    }

    const cleanedPayload = {
      ...form,
      slug: form.slug.trim() || toVietnameseSlug(form.name),
      seasonalAttributes: {
        ...form.seasonalAttributes,
        colors: (form.seasonalAttributes.colors || []).filter(Boolean),
        materials: (form.seasonalAttributes.materials || []).filter(Boolean),
      },
      products: selectedProducts.map((p) => ({ id: p.id })),
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await handleUpdateCollection(cleanedPayload as unknown as Season);
      } else {
        await handleAddCollection(cleanedPayload as unknown as Season);
      }
      setState(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-paper border-2 border-ink shadow-hard-lg w-full max-w-6xl my-6 relative overflow-hidden">
      <div className="bg-ink text-paper px-6 py-4 flex items-center justify-between border-b-2 border-ink">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-volt" />
          <div>
            <span className="mono-label text-[10px] text-volt block">
              [SEASONAL DOSSIER EDITOR]
            </span>
            <h2 className="font-display-safe text-xl font-black uppercase text-paper">
              {isEditMode ? `Chỉnh sửa: ${season?.name}` : "Tạo Bộ Sưu Tập Mới"}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setState(false)}
          className="min-w-[44px] min-h-[44px] bg-paper text-ink border-2 border-ink flex items-center justify-center hover:bg-flash hover:text-paper transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 md:p-7 max-h-[84vh] overflow-y-auto bg-bone">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 6 Cols: Metadata + Banner + Attributes */}
          <div className="lg:col-span-6 space-y-5 bg-paper border-2 border-ink p-5 shadow-hard-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-ink mb-1.5 block">
                  Tên bộ sưu tập / mùa *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Xuân Hè 2026"
                  className="w-full h-11 border-2 border-ink bg-bone px-3 font-sans text-sm text-ink focus:bg-paper outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-bold uppercase text-ink mb-1.5 block">
                  Đường dẫn Slug (Tự tạo)
                </label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="xuan-he-2026"
                  className="w-full h-11 border-2 border-ink bg-bone px-3 font-mono text-xs text-ink focus:bg-paper outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-ink mb-1.5 block">
                Slogan nổi bật
              </label>
              <input
                name="slogan"
                value={form.slogan}
                onChange={handleChange}
                placeholder="VD: Thanh thoát giữa những ngày nắng..."
                className="w-full h-11 border-2 border-ink bg-bone px-3 font-sans text-sm text-ink focus:bg-paper outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] font-bold uppercase text-ink mb-1.5 block">
                Mô tả câu chuyện bộ sưu tập
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Mô tả cảm hứng chất liệu, phom dáng..."
                className="w-full border-2 border-ink bg-bone p-3 font-sans text-sm text-ink focus:bg-paper outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[11px] font-bold uppercase text-ink block">
                Ảnh Banner chiến dịch
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <label className="h-11 px-3 border-2 border-dashed border-ink bg-bone hover:bg-volt/30 cursor-pointer flex items-center justify-center gap-2 font-mono text-xs font-bold shrink-0">
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={14} />
                      <span>Tải ảnh lên</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={(e) => {
                      void handleUploadBanner(e.target.files?.[0] || null);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>

                <input
                  name="banner"
                  value={form.banner}
                  onChange={handleChange}
                  placeholder="Hoặc dán URL ảnh (https://...)"
                  className="flex-1 h-11 border-2 border-ink bg-bone px-3 font-mono text-xs text-ink focus:bg-paper outline-none"
                />
              </div>

              {form.banner && (
                <div className="mt-2 border-2 border-ink overflow-hidden bg-bone">
                  <img
                    src={form.banner}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="bg-bone border-2 border-ink p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase text-ink flex items-center gap-1.5">
                  <Sparkles size={13} className="text-flash" />
                  Thuộc tính mùa (Bấm để chọn nhanh)
                </h3>
              </div>

              {/* Colors */}
              <div>
                <label className="mono-label text-[10px] text-ink-muted block mb-1">
                  Bảng màu chủ đạo
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {COLOR_SUGGESTIONS.map((c) => {
                    const active = form.seasonalAttributes.colors.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleChipAttr("colors", c)}
                        className={`px-2 py-0.5 border border-ink font-mono text-[10px] font-bold cursor-pointer ${
                          active ? "bg-volt text-ink" : "bg-paper text-ink hover:bg-fog"
                        }`}
                      >
                        {active ? `✓ ${c}` : `+ ${c}`}
                      </button>
                    );
                  })}
                </div>
                <input
                  value={form.seasonalAttributes.colors.join(", ")}
                  onChange={(e) =>
                    handleAttrChange(
                      "colors",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="VD: Đen, Trắng Kem, Be"
                  className="h-10 border-2 border-ink bg-paper px-3 font-mono text-xs w-full outline-none"
                />
              </div>

              {/* Materials */}
              <div>
                <label className="mono-label text-[10px] text-ink-muted block mb-1">
                  Chất liệu nổi bật
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {MATERIAL_SUGGESTIONS.map((m) => {
                    const active = form.seasonalAttributes.materials.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleChipAttr("materials", m)}
                        className={`px-2 py-0.5 border border-ink font-mono text-[10px] font-bold cursor-pointer ${
                          active ? "bg-volt text-ink" : "bg-paper text-ink hover:bg-fog"
                        }`}
                      >
                        {active ? `✓ ${m}` : `+ ${m}`}
                      </button>
                    );
                  })}
                </div>
                <input
                  value={form.seasonalAttributes.materials.join(", ")}
                  onChange={(e) =>
                    handleAttrChange(
                      "materials",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="VD: Linen, Silk, Cotton"
                  className="h-10 border-2 border-ink bg-paper px-3 font-mono text-xs w-full outline-none"
                />
              </div>

              {/* Mood & Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mono-label text-[10px] text-ink-muted block mb-1">
                    Cảm hứng / Phong cách
                  </label>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {MOOD_SUGGESTIONS.map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => handleAttrChange("mood", mood)}
                        className={`px-1.5 py-0.5 border border-ink font-mono text-[9px] font-bold cursor-pointer ${
                          form.seasonalAttributes.mood === mood
                            ? "bg-ink text-volt"
                            : "bg-paper text-ink"
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                  <input
                    value={form.seasonalAttributes.mood}
                    onChange={(e) => handleAttrChange("mood", e.target.value)}
                    placeholder="VD: Tối giản"
                    className="h-10 border-2 border-ink bg-paper px-3 font-mono text-xs w-full outline-none"
                  />
                </div>

                <div>
                  <label className="mono-label text-[10px] text-ink-muted block mb-1">
                    Thời tiết phù hợp
                  </label>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {TEMP_SUGGESTIONS.map((temp) => (
                      <button
                        key={temp}
                        type="button"
                        onClick={() => handleAttrChange("temperature", temp)}
                        className={`px-1.5 py-0.5 border border-ink font-mono text-[9px] font-bold cursor-pointer ${
                          form.seasonalAttributes.temperature === temp
                            ? "bg-ink text-volt"
                            : "bg-paper text-ink"
                        }`}
                      >
                        {temp}
                      </button>
                    ))}
                  </div>
                  <input
                    value={form.seasonalAttributes.temperature}
                    onChange={(e) => handleAttrChange("temperature", e.target.value)}
                    placeholder="VD: Hè nắng"
                    className="h-10 border-2 border-ink bg-paper px-3 font-mono text-xs w-full outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-ink">
              <span className="font-mono text-xs font-bold uppercase text-ink">
                Hiển thị ngoài cửa hàng:
              </span>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
                className={`px-3 py-1.5 border-2 border-ink font-mono text-xs font-extrabold uppercase cursor-pointer ${
                  form.active ? "bg-volt text-ink" : "bg-fog text-ink-muted"
                }`}
              >
                {form.active ? "Đang bật" : "Tạm ẩn"}
              </button>
            </div>
          </div>

          {/* Right 6 Cols: Visual Product Picker */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-paper border-2 border-ink p-5 shadow-hard-sm">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="font-mono text-xs font-bold uppercase text-ink">
                  Chọn sản phẩm thuộc bộ sưu tập ({selectedProducts.length} đã chọn)
                </h3>
                {filteredList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllFiltered}
                    className="font-mono text-[10px] font-bold uppercase underline hover:text-flash cursor-pointer"
                  >
                    + Chọn tất cả đang lọc ({filteredList.length})
                  </button>
                )}
              </div>

              <div className="relative mb-3">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tìm theo tên hoặc thương hiệu..."
                  className="w-full h-11 border-2 border-ink bg-bone pl-9 pr-3 font-mono text-xs text-ink focus:bg-paper outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <button
                  type="button"
                  onClick={() => setFilteredSeason("")}
                  className={`min-h-[32px] px-2.5 py-1 border-2 border-ink font-mono text-[10px] font-bold uppercase cursor-pointer ${
                    filteredSeason === ""
                      ? "bg-ink text-paper"
                      : "bg-bone text-ink hover:bg-volt"
                  }`}
                >
                  Tất cả
                </button>
                {Array.from(
                  new Set(dataProduct?.map((p) => p.season).filter(Boolean))
                ).map((seasonName) => (
                  <button
                    type="button"
                    key={seasonName}
                    onClick={() =>
                      setFilteredSeason(
                        seasonName === filteredSeason ? "" : (seasonName ?? "")
                      )
                    }
                    className={`min-h-[32px] px-2.5 py-1 border-2 border-ink font-mono text-[10px] font-bold uppercase cursor-pointer ${
                      filteredSeason === seasonName
                        ? "bg-ink text-paper"
                        : "bg-bone text-ink hover:bg-volt"
                    }`}
                  >
                    {seasonName}
                  </button>
                ))}
              </div>

              <ul className="overflow-y-auto border-2 border-ink p-2 bg-bone max-h-[320px] space-y-1.5">
                {filteredList.length === 0 ? (
                  <li className="py-8 text-center font-mono text-xs text-ink-muted">
                    Không tìm thấy sản phẩm phù hợp
                  </li>
                ) : (
                  filteredList.map((product) => {
                    const isSelected = selectedIdSet.has(product.id);
                    const img = getPrimaryProductImage(product);
                    return (
                      <li key={product.id}>
                        <button
                          type="button"
                          onClick={() => handleToggleProduct(product)}
                          className={`w-full flex items-center justify-between gap-3 border-2 p-2 text-left cursor-pointer transition ${
                            isSelected
                              ? "border-ink bg-volt text-ink font-bold shadow-hard-sm"
                              : "border-ink/40 bg-paper text-ink hover:border-ink"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {img ? (
                              <img
                                src={img}
                                alt={product.name}
                                className="w-10 h-10 object-cover border border-ink shrink-0"
                              />
                            ) : (
                              <div className="studio-grid-bg w-10 h-10 border border-ink shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-sans text-xs font-bold truncate">
                                {product.name}
                              </p>
                              <p className="font-mono text-[10px] text-ink-muted">
                                {formatVND(product.price)} · {product.brand || "Aurelia"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`w-6 h-6 border-2 border-ink flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-ink text-volt" : "bg-bone text-transparent"
                            }`}
                          >
                            <Check size={13} strokeWidth={3} />
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>

              {selectedProducts.length > 0 && (
                <div className="mt-4 pt-3 border-t-2 border-dashed border-ink">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-mono text-xs font-bold uppercase text-ink">
                      Đã chọn ({selectedProducts.length})
                    </h4>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="font-mono text-[11px] font-bold text-danger uppercase hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Bỏ chọn hết
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {selectedProducts.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => handleToggleProduct(p)}
                        className="flex items-center gap-1.5 bg-bone border border-ink px-2 py-1 cursor-pointer hover:bg-danger hover:text-paper transition-colors"
                      >
                        {getPrimaryProductImage(p) && (
                          <img
                            src={getPrimaryProductImage(p)}
                            alt={p.name}
                            className="w-5 h-5 object-cover border border-ink"
                          />
                        )}
                        <span className="font-mono text-[11px] truncate max-w-[130px]">
                          {p.name}
                        </span>
                        <X className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-ink flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setState(false)}
                className="min-h-[46px] px-5 bg-bone border-2 border-ink font-mono text-xs font-bold uppercase text-ink hover:bg-fog cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={isSubmitting || isUploading}
                onClick={handleSubmit}
                className="min-h-[46px] px-6 bg-flash text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-ink transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                <span>
                  {isSubmitting
                    ? "Đang lưu..."
                    : isEditMode
                      ? "Cập Nhật Bộ Sưu Tập"
                      : "Tạo Bộ Sưu Tập"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
