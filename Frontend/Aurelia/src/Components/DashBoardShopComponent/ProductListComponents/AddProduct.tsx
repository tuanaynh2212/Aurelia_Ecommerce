import React, { useContext, useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Product } from "../../../types/type";
import { v4 as uuid } from "uuid";
import { DashBoardShopCOntext } from "../../../contexts/DashBoardShopContext";

export const AddProduct = ({
  onClose,
  title,
  dataEdit,
  ProductId,
  sold,
}: {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  dataEdit: Product[];
  ProductId: string;
  sold: number;
}) => {
  const dataFilter = dataEdit.filter((item) => item.id === ProductId);
  const dataEditProduct = dataFilter.length > 0 ? dataFilter[0] : null;
  const [sizes, setSizes] = useState<string[]>(
    dataEditProduct
      ? dataEditProduct.variants.flatMap((v) => v.sizes.map((s) => s.size))
      : []
  );
  const [colors, setColors] = useState<string[]>(
    dataEditProduct ? dataEditProduct.variants.map((v) => v.color) : []
  );
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [ImageUrl, setImageUrl] = useState<string[]>(
    files.length === 0 && dataEditProduct ? dataEditProduct.images : []
  );
  const { updateProduct, editProduct, taskFetchSanPham } =
    useContext(DashBoardShopCOntext);

  const addSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const uploadImage = async (file: File[]) => {
    try {
      const apiKey = "0d1c3d8a0af15e271bc8154578e71620";
      const formData = new FormData();
      file.forEach((f) => {
        formData.append("image", f);
      });

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Upload failed");
      }

      return data.data.image.url;
    } catch (err) {
      console.error("Upload error:", err);
      return "";
    }
  };

  useEffect(() => {
    files.forEach((element) => {
      uploadImage([element]).then((url) => {
        setImageUrl((prev) => [url, ...prev]);
      });
    });
  }, [files]);

  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput)) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const removeSize = (value: string) => {
    setSizes(sizes.filter((s) => s !== value));
  };

  const removeColor = (value: string) => {
    setColors(colors.filter((c) => c !== value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const [tenSanPham, setTenSanPham] = useState(
    dataEditProduct ? dataEditProduct.name : ""
  );
  const [moTa, setMoTa] = useState(
    dataEditProduct ? dataEditProduct.description : ""
  );
  const [thuongHieu, setThuongHieu] = useState(
    dataEditProduct ? dataEditProduct.brand : ""
  );
  const [loaiSanPham, setLoaiSanPham] = useState(
    dataEditProduct ? dataEditProduct.type : ""
  );
  const [theLoai, setTheLoai] = useState(
    dataEditProduct ? dataEditProduct.subcategory : ""
  );
  const [xuatXu, setXuatXu] = useState(
    dataEditProduct ? dataEditProduct.origin : ""
  );
  const [giaSanPham, setGiaSanPham] = useState(
    dataEditProduct ? dataEditProduct.price.toString() : ""
  );
  const [khoHang, setKhoHang] = useState(
    dataEditProduct ? dataEditProduct.stock.toString() : ""
  );

  const data: Product = {
    id:
      title === "Thêm Sản Phẩm Mới"
        ? uuid()
        : dataEditProduct
        ? dataEditProduct.id
        : "",
    name: tenSanPham,
    description: moTa,
    brand: thuongHieu,
    type: loaiSanPham,
    subcategory: theLoai,
    origin: xuatXu,
    price: parseFloat(giaSanPham),
    stock: parseInt(khoHang),
    sold: sold,
    images: ImageUrl,
    thumbnail: ImageUrl[0],
    rating: dataEditProduct ? dataEditProduct.rating : 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    material: "",
    variants: [
      {
        color: colors[0] || "Default",
        sizes: sizes.map((size) => ({ size, quantity: 0 })),
      },
    ],
    discountType: dataEditProduct ? dataEditProduct.discountType : "",
    discountValue: dataEditProduct ? dataEditProduct.discountValue : 0,
    season: "",
  };

  const handleClickUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data && title === "Thêm Sản Phẩm Mới") {
      await updateProduct(data);
      onClose(false);
    }
    if (dataEditProduct && title === "Sửa Sản Phẩm") {
      await editProduct(data);
      onClose(false);
    }
    taskFetchSanPham();
  };

  const inputClass =
    "w-full min-h-[44px] border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-2.5 font-mono text-xs text-[var(--color-ink)] focus:outline-none focus:bg-[var(--color-volt)]/15";

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)]/70 flex items-center justify-center z-50 text-[var(--color-ink)] p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)]">
        <div className="flex items-center justify-between p-5 bg-[var(--color-ink)] text-[var(--color-paper)] border-b-2 border-[var(--color-ink)]">
          <div>
            <span className="mono-label text-[var(--color-volt)]">
              [SPECIFICATION EDITOR]
            </span>
            <h1 className="display-m font-display-safe text-[var(--color-paper)]">
              {title}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-flash)] hover:text-[var(--color-paper)] border-2 border-[var(--color-ink)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          <form className="flex-1 p-6 border-b-2 md:border-b-0 md:border-r-2 border-[var(--color-ink)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Tên Sản Phẩm", id: "name", value: tenSanPham },
                { label: "Thương Hiệu", id: "brand", value: thuongHieu },
                { label: "Loại Sản Phẩm", id: "type", value: loaiSanPham },
                { label: "Thể Loại", id: "subcategory", value: theLoai },
                { label: "Xuất Xứ", id: "origin", value: xuatXu },
                { label: "Giá Sản Phẩm (₫)", id: "price", value: giaSanPham },
              ].map((item) => (
                <div key={item.id}>
                  <label
                    htmlFor={item.id}
                    className="block mono-label text-[var(--color-ink)] mb-1"
                  >
                    {item.label}
                  </label>
                  <input
                    onChange={(e) => {
                      const value = e.target.value;
                      switch (item.label) {
                        case "Tên Sản Phẩm":
                          setTenSanPham(value);
                          break;
                        case "Thương Hiệu":
                          setThuongHieu(value);
                          break;
                        case "Loại Sản Phẩm":
                          setLoaiSanPham(value);
                          break;
                        case "Thể Loại":
                          setTheLoai(value);
                          break;
                        case "Xuất Xứ":
                          setXuatXu(value);
                          break;
                        case "Giá Sản Phẩm (₫)":
                          setGiaSanPham(value);
                          break;
                        default:
                          break;
                      }
                    }}
                    id={item.id}
                    value={
                      title === "Sửa Sản Phẩm" && dataEditProduct
                        ? item.value
                        : undefined
                    }
                    type="text"
                    className={inputClass}
                    placeholder={item.label}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label
                htmlFor="description"
                className="block mono-label text-[var(--color-ink)] mb-1"
              >
                Mô Tả Sản Phẩm
              </label>
              <textarea
                onChange={(e) => setMoTa(e.target.value)}
                id="description"
                rows={4}
                className={inputClass}
                placeholder="Nhập mô tả sản phẩm..."
              />
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleClickUpdateStatus}
                className="min-h-[48px] bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] px-6 py-2.5 mono-label font-extrabold cursor-pointer"
              >
                {title === "Sửa Sản Phẩm"
                  ? "Cập Nhật Sản Phẩm"
                  : "Thêm Sản Phẩm"}
              </button>
            </div>
          </form>

          <div className="w-full md:w-1/3 p-6 bg-[var(--color-bone)] space-y-5">
            <div>
              <h2 className="mono-label font-extrabold text-[var(--color-ink)] mb-1.5">
                Kho Hàng
              </h2>
              <input
                onChange={(e) => setKhoHang(e.target.value)}
                type="number"
                placeholder="Số lượng trong kho"
                className={inputClass}
              />
            </div>

            <div>
              <h2 className="mono-label font-extrabold text-[var(--color-ink)] mb-1.5">
                Ảnh Sản Phẩm
              </h2>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={inputClass}
              />
              {files.length === 0 && ImageUrl.length === 0 && (
                <p className="mono-label text-[10px] text-[var(--color-ink-muted)] mt-1">
                  Chọn ảnh sản phẩm (có thể chọn nhiều ảnh)
                </p>
              )}
              {(files.length > 0 || ImageUrl.length > 0) && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(files.length === 0 ? ImageUrl : files).map(
                    (f: File | string, i: number) => (
                      <div
                        key={i}
                        className="relative bg-[var(--color-paper)] border-2 border-[var(--color-ink)] overflow-hidden"
                      >
                        <img
                          src={
                            typeof f === "string"
                              ? f
                              : URL.createObjectURL(f)
                          }
                          alt=""
                          className="w-full h-20 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 bg-[var(--color-danger)] text-[var(--color-paper)] p-1 border border-[var(--color-ink)] cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block mono-label text-[var(--color-ink)] mb-1">
                Size
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  className={inputClass}
                  placeholder="VD: M, L, XL"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="min-w-[44px] bg-[var(--color-volt)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] flex items-center justify-center cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] px-2.5 py-1 mono-label"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeSize(item)}
                      className="text-[var(--color-danger)] cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block mono-label text-[var(--color-ink)] mb-1">
                Màu
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className={inputClass}
                  placeholder="VD: Đỏ, Đen..."
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="min-w-[44px] bg-[var(--color-volt)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] flex items-center justify-center cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] px-2.5 py-1 mono-label"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeColor(item)}
                      className="text-[var(--color-danger)] cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
