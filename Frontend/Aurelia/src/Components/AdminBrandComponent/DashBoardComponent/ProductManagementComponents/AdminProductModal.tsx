import React, { useContext, useMemo, useState } from "react";
import {
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { v4 as uuid } from "uuid";
import type { Product } from "../../../../types/type";
import { FilterProductContext } from "../../../../contexts/FIlterProduct";
import { CartContext } from "../../../../contexts/CartContext";
import { api_Config, UseApiUrl } from "../../../../services/api";
import { api_Response } from "../../../../services/http";
import { Toaster } from "../../../Toaster";
import { SegmentMeter } from "../../../UI/primitives/SegmentMeter";
import { formatVND } from "../../../../utils/formatters";
import { uploadImageToImgbb } from "../adminUpload";

type AdminProductModalProps = {
  mode: "add" | "edit";
  initialProduct?: Product | null;
  onClose: () => void;
};

const PRODUCT_TYPES = ["Dress", "Clothing", "Jewelry", "Accessory", "Watch"];
const SEASON_OPTIONS = ["Spring", "Summer", "Autumn", "Winter", "All Season"];
const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "Free Size"];
const COMMON_COLORS = ["Đen", "Trắng", "Kem", "Đỏ", "Vàng", "Xanh rêu"];

function extractUniqueSizes(product?: Product | null): string[] {
  if (!product?.variants?.length) return ["S", "M", "L"];
  const set = new Set<string>();
  for (const variant of product.variants) {
    for (const s of variant.sizes || []) {
      if (s.size) set.add(s.size);
    }
  }
  return set.size > 0 ? Array.from(set) : ["S", "M", "L"];
}

function extractUniqueColors(product?: Product | null): string[] {
  if (!product?.variants?.length) return ["Đen"];
  const list = product.variants
    .map((v) => v.color?.trim())
    .filter((c): c is string => Boolean(c));
  return list.length > 0 ? Array.from(new Set(list)) : ["Đen"];
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  mode,
  initialProduct,
  onClose,
}) => {
  const { setDataProduct } = useContext(FilterProductContext);
  const { formatPrice } = useContext(CartContext);
  const formatDisplayPrice = formatPrice ?? formatVND;

  const isEdit = mode === "edit" && Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || "");
  const [brand, setBrand] = useState(initialProduct?.brand || "AURELIA");
  const [origin, setOrigin] = useState(initialProduct?.origin || "Việt Nam");
  const [material, setMaterial] = useState(initialProduct?.material || "Silk");
  const [type, setType] = useState(initialProduct?.type || "Dress");
  const [subcategory, setSubcategory] = useState(
    initialProduct?.subcategory || "",
  );
  const [season, setSeason] = useState(initialProduct?.season || "Spring");
  const [price, setPrice] = useState(
    initialProduct?.price ? String(initialProduct.price) : "",
  );
  const [stock, setStock] = useState(
    initialProduct?.stock !== undefined ? String(initialProduct.stock) : "20",
  );
  const [discountType, setDiscountType] = useState<"percent" | "fixed">(
    initialProduct?.discountType === "fixed" ? "fixed" : "percent",
  );
  const [discountValue, setDiscountValue] = useState(
    initialProduct?.discountValue ? String(initialProduct.discountValue) : "0",
  );
  const [description, setDescription] = useState(
    initialProduct?.description || "",
  );

  const initialImages = useMemo(() => {
    const list: string[] = [];
    if (initialProduct?.thumbnail) list.push(initialProduct.thumbnail);
    for (const img of initialProduct?.images || []) {
      if (img && !list.includes(img)) list.push(img);
    }
    return list;
  }, [initialProduct]);

  const [images, setImages] = useState<string[]>(initialImages);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    initialProduct?.thumbnail || initialImages[0] || "",
  );
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [colors, setColors] = useState<string[]>(
    extractUniqueColors(initialProduct),
  );
  const [sizes, setSizes] = useState<string[]>(
    extractUniqueSizes(initialProduct),
  );
  const [customColor, setCustomColor] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const numericPrice = Math.max(0, Number(price) || 0);
  const numericStock = Math.max(0, Math.floor(Number(stock) || 0));
  const numericDiscount = Math.max(0, Number(discountValue) || 0);

  const finalPricePreview = useMemo(() => {
    if (numericDiscount <= 0) return numericPrice;
    if (discountType === "percent") {
      const pct = Math.min(95, numericDiscount);
      return Math.max(0, Math.round(numericPrice * (1 - pct / 100)));
    }
    return Math.max(0, numericPrice - numericDiscount);
  }, [numericPrice, numericDiscount, discountType]);

  const handleToggleItem = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    minOne = true,
  ) => {
    if (list.includes(value)) {
      if (minOne && list.length <= 1) return;
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleAddCustomColor = () => {
    const clean = customColor.trim();
    if (!clean) return;
    if (!colors.includes(clean)) setColors([...colors, clean]);
    setCustomColor("");
  };

  const handleAddCustomSize = () => {
    const clean = customSize.trim().toUpperCase();
    if (!clean) return;
    if (!sizes.includes(clean)) setSizes([...sizes, clean]);
    setCustomSize("");
  };

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (fileList.length === 0) return;

    setUploadingImage(true);
    try {
      const uploaded: string[] = [];
      for (const file of fileList) {
        const url = await uploadImageToImgbb(file);
        uploaded.push(url);
      }
      setImages((prev) => {
        const next = [...prev];
        for (const url of uploaded) {
          if (!next.includes(url)) next.push(url);
        }
        return next;
      });
      if (!thumbnailUrl && uploaded[0]) {
        setThumbnailUrl(uploaded[0]);
      }
      Toaster.success(`Đã tải lên ${uploaded.length} ảnh thành công`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Tải ảnh thất bại";
      Toaster.error(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    const clean = imageUrlInput.trim();
    if (!clean) return;
    if (!images.includes(clean)) {
      setImages((prev) => [...prev, clean]);
    }
    if (!thumbnailUrl) {
      setThumbnailUrl(clean);
    }
    setImageUrlInput("");
  };

  const handleRemoveImage = (url: string) => {
    const next = images.filter((img) => img !== url);
    setImages(next);
    if (thumbnailUrl === url) {
      setThumbnailUrl(next[0] || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      Toaster.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!type.trim()) {
      Toaster.error("Vui lòng chọn loại sản phẩm");
      return;
    }
    if (numericPrice <= 0) {
      Toaster.error("Giá sản phẩm phải lớn hơn 0");
      return;
    }
    if (!thumbnailUrl && images.length === 0) {
      Toaster.error("Vui lòng thêm ít nhất 1 ảnh cho sản phẩm");
      return;
    }

    const activeColors = colors.length > 0 ? colors : ["Đen"];
    const activeSizes = sizes.length > 0 ? sizes : ["M"];
    const totalSlots = activeColors.length * activeSizes.length;
    const perSlotQty = Math.max(1, Math.floor(numericStock / totalSlots));

    const payload: Product = {
      id: isEdit && initialProduct ? initialProduct.id : `prd-${uuid().slice(0, 8)}`,
      name: name.trim(),
      type: type.trim(),
      subcategory: subcategory.trim() || type.trim(),
      brand: brand.trim() || "AURELIA",
      origin: origin.trim() || "Việt Nam",
      price: numericPrice,
      description: description.trim() || `${name.trim()} — chế tác tỉ mỉ bởi ${brand.trim() || "AURELIA"}.`,
      rating: initialProduct?.rating || 5,
      stock: numericStock,
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: thumbnailUrl || images[0],
      images: images.length > 0 ? images : [thumbnailUrl],
      material: material.trim() || "Silk",
      variants: activeColors.map((color) => ({
        color,
        sizes: activeSizes.map((size) => ({
          size,
          quantity: perSlotQty,
        })),
      })),
      sold: initialProduct?.sold ?? 0,
      discountValue: numericDiscount,
      discountType: numericDiscount > 0 ? discountType : "",
      season: season || "Spring",
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await api_Response(
          UseApiUrl(api_Config.Product.UpdateProduct),
          "PUT",
          payload,
          { "Content-Type": "application/json" },
        );
        setDataProduct((prev) => {
          const next = prev.map((p) => (p.id === payload.id ? payload : p));
          localStorage.setItem("allProducts", JSON.stringify(next));
          return next;
        });
        Toaster.success(`Đã cập nhật "${payload.name}"`);
      } else {
        await api_Response(
          UseApiUrl(api_Config.Product.PostProduct),
          "POST",
          [payload],
          { "Content-Type": "application/json" },
        );
        setDataProduct((prev) => {
          const next = [payload, ...prev];
          localStorage.setItem("allProducts", JSON.stringify(next));
          return next;
        });
        Toaster.success(`Đã thêm sản phẩm "${payload.name}"`);
      }
      onClose();
    } catch (error) {
      console.error("AdminProductModal submit failed:", error);
      Toaster.error(
        isEdit
          ? "Không thể cập nhật sản phẩm. Kiểm tra đăng nhập Admin và thử lại."
          : "Không thể thêm sản phẩm mới. Kiểm tra đăng nhập Admin và thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/70 flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto">
      <div className="bg-paper border-2 border-ink shadow-hard-lg w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-ink text-paper border-b-2 border-ink flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-volt block">
              {isEdit
                ? `[CHỈNH SỬA SẢN PHẨM // ${initialProduct?.id}]`
                : "[THÊM SẢN PHẨM MỚI // CATALOG STUDIO]"}
            </span>
            <h2 className="font-display-safe text-xl sm:text-2xl font-black uppercase">
              {isEdit ? `Sửa: ${initialProduct?.name}` : "Tạo Sản Phẩm Mới"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] border-2 border-paper bg-ink text-paper hover:bg-flash flex items-center justify-center cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 p-6 space-y-6 border-b-2 lg:border-b-0 lg:border-r-2 border-ink">
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-ink pb-2">
                <Tag className="w-4 h-4 text-flash" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  1. Thông tin cơ bản
                </h3>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                  Tên sản phẩm <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Đầm Lụa Aurelia Midnight"
                  className="w-full h-11 px-3.5 bg-bone border-2 border-ink font-sans text-sm text-ink focus:bg-paper outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Thương hiệu
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="AURELIA"
                    className="w-full h-11 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Chất liệu
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Silk / Wool / Leather"
                    className="w-full h-11 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Xuất xứ
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Việt Nam / Italy"
                    className="w-full h-11 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-ink pb-2">
                <Sparkles className="w-4 h-4 text-flash" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  2. Danh mục & Mùa bộ sưu tập
                </h3>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-2">
                  Loại sản phẩm <span className="text-danger">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_TYPES.map((t) => {
                    const active = type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`min-h-[38px] px-3 border-2 border-ink font-mono text-xs font-bold uppercase cursor-pointer transition-colors ${
                          active
                            ? "bg-volt text-ink shadow-hard-sm"
                            : "bg-bone text-ink hover:bg-paper"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Danh mục phụ (tuỳ chọn)
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="VD: Evening Gown, Blazer..."
                    className="w-full h-11 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink focus:bg-paper outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Mùa / Chiến dịch
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SEASON_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSeason(s)}
                        className={`px-2.5 py-2 border-2 border-ink font-mono text-[11px] font-bold uppercase cursor-pointer ${
                          season === s
                            ? "bg-ink text-volt"
                            : "bg-bone text-ink hover:bg-paper"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-ink pb-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  3. Giá bán, Tồn kho & Khuyến mãi
                </h3>
                {numericPrice > 0 && (
                  <span className="font-mono text-xs font-bold bg-volt px-2 py-0.5 border border-ink">
                    Giá sau giảm: {formatDisplayPrice(finalPricePreview)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Giá gốc (VNĐ) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2500000"
                    className="w-full h-11 px-3 bg-bone border-2 border-ink font-mono text-xs font-bold text-ink focus:bg-paper outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full h-11 px-3 bg-bone border-2 border-ink font-mono text-xs font-bold text-ink focus:bg-paper outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Kiểu giảm giá
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as "percent" | "fixed")
                    }
                    className="w-full h-11 px-2.5 bg-bone border-2 border-ink font-mono text-xs font-bold text-ink focus:bg-paper outline-none"
                  >
                    <option value="percent">% Phần trăm</option>
                    <option value="fixed">VNĐ Cố định</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                    Giá trị giảm
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full h-11 px-3 bg-bone border-2 border-ink font-mono text-xs font-bold text-ink focus:bg-paper outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="border-b border-ink pb-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  4. Màu sắc & Kích cỡ
                </h3>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-2">
                  Màu có sẵn ({colors.length})
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.from(new Set([...COMMON_COLORS, ...colors])).map(
                    (c) => {
                      const active = colors.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleToggleItem(c, colors, setColors)}
                          className={`px-3 py-1.5 border-2 border-ink font-mono text-xs font-bold cursor-pointer flex items-center gap-1 ${
                            active
                              ? "bg-ink text-paper"
                              : "bg-bone text-ink hover:bg-volt/40"
                          }`}
                        >
                          {active && <Check className="w-3 h-3 text-volt" />}
                          {c}
                        </button>
                      );
                    },
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomColor();
                      }
                    }}
                    placeholder="Thêm màu khác (VD: Bạc ánh kim)"
                    className="flex-1 h-10 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-4 h-10 bg-paper border-2 border-ink font-mono text-xs font-bold uppercase hover:bg-volt cursor-pointer"
                  >
                    + Màu
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-2">
                  Kích cỡ có sẵn ({sizes.length})
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.from(new Set([...COMMON_SIZES, ...sizes])).map((s) => {
                    const active = sizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleToggleItem(s, sizes, setSizes)}
                        className={`min-w-[44px] h-9 px-3 border-2 border-ink font-mono text-xs font-bold cursor-pointer ${
                          active
                            ? "bg-volt text-ink shadow-hard-sm"
                            : "bg-bone text-ink hover:bg-paper"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                    placeholder="Thêm size riêng (VD: 38, XXL)"
                    className="flex-1 h-10 px-3 bg-bone border-2 border-ink font-mono text-xs text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-4 h-10 bg-paper border-2 border-ink font-mono text-xs font-bold uppercase hover:bg-volt cursor-pointer"
                  >
                    + Size
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả phom dáng, chất liệu, dịp sử dụng và điểm nhấn thiết kế..."
                  className="w-full p-3 bg-bone border-2 border-ink font-sans text-sm text-ink focus:bg-paper outline-none resize-none"
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 bg-bone p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-ink pb-2">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                    5. Hình ảnh sản phẩm ({images.length})
                  </h3>
                  <label className="px-3 py-1.5 bg-volt text-ink border-2 border-ink font-mono text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer hover:bg-ink hover:text-volt transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ImagePlus className="w-3.5 h-3.5" />
                    )}
                    {uploadingImage ? "Đang tải..." : "Tải ảnh lên"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleUploadFiles}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    placeholder="Hoặc dán URL ảnh (https://...)"
                    className="flex-1 h-10 px-3 bg-paper border-2 border-ink font-mono text-xs text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 h-10 bg-paper border-2 border-ink font-mono text-xs font-bold uppercase hover:bg-volt cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    URL
                  </button>
                </div>

                {images.length === 0 ? (
                  <div className="border-2 border-dashed border-ink bg-paper p-6 text-center font-mono text-xs text-ink-muted">
                    Chưa có ảnh nào. Hãy nhấn &ldquo;Tải ảnh lên&rdquo; hoặc dán URL ảnh bên trên.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5">
                    {images.map((url, idx) => {
                      const isMain = thumbnailUrl === url || (!thumbnailUrl && idx === 0);
                      return (
                        <div
                          key={`${url}-${idx}`}
                          className={`relative aspect-[3/4] border-2 border-ink bg-paper overflow-hidden group ${
                            isMain ? "ring-2 ring-flash" : ""
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Ảnh ${idx + 1}`}
                            onClick={() => setThumbnailUrl(url)}
                            className="w-full h-full object-cover cursor-pointer"
                          />
                          {isMain ? (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-volt text-ink border border-ink font-mono text-[9px] font-bold uppercase">
                              Ảnh chính
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setThumbnailUrl(url)}
                              className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-ink/80 text-paper font-mono text-[9px] uppercase opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              Chọn chính
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(url)}
                            className="absolute top-1 right-1 w-6 h-6 bg-paper border border-ink text-danger hover:bg-danger hover:text-paper flex items-center justify-center cursor-pointer"
                            aria-label="Xóa ảnh"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  [XEM TRƯỚC THẺ SẢN PHẨM]
                </span>
                <div className="bg-paper border-2 border-ink shadow-hard p-4 space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-20 h-24 bg-bone border-2 border-ink shrink-0 overflow-hidden flex items-center justify-center">
                      {thumbnailUrl || images[0] ? (
                        <img
                          src={thumbnailUrl || images[0]}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-mono text-[10px] text-ink-muted">
                          NO IMG
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 bg-ink text-paper font-mono text-[9px] font-bold uppercase">
                          {type || "TYPE"}
                        </span>
                        <span className="px-1.5 py-0.5 bg-bone border border-ink font-mono text-[9px] font-bold uppercase">
                          {season}
                        </span>
                      </div>
                      <h4 className="font-display-safe text-base font-black uppercase text-ink truncate">
                        {name.trim() || "Tên sản phẩm"}
                      </h4>
                      <p className="font-mono text-[11px] text-ink-muted">
                        {brand || "AURELIA"} · {material || "Silk"}
                      </p>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="font-mono text-sm font-bold text-ink">
                          {formatDisplayPrice(finalPricePreview)}
                        </span>
                        {numericDiscount > 0 && numericPrice > 0 && (
                          <>
                            <span className="font-mono text-[11px] line-through text-ink-muted">
                              {formatDisplayPrice(numericPrice)}
                            </span>
                            <span className="bg-volt px-1 border border-ink font-mono text-[10px] font-bold">
                              -{numericDiscount}
                              {discountType === "percent" ? "%" : "₫"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-ink">
                      <span>Tồn kho: {numericStock}</span>
                      <span>
                        {colors.length} màu · {sizes.length} size
                      </span>
                    </div>
                    <SegmentMeter
                      value={Math.min(100, numericStock)}
                      max={100}
                      segments={10}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-ink flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 min-h-[46px] px-4 bg-paper text-ink border-2 border-ink font-mono text-xs font-bold uppercase hover:bg-bone cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="flex-[2] min-h-[46px] px-5 bg-flash text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase hover:bg-ink transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Lưu Thay Đổi" : "Đăng Sản Phẩm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

