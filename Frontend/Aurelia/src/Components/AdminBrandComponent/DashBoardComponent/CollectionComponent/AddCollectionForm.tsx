import { X, XCircleIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import { FilterProductContext } from "../../../../contexts/FIlterProduct";
import { CollectionContext } from "../../../../contexts/SeasonContext";
import { v4 as uuid } from "uuid";
export default function AddCollectionForm({
  setState,
  status,
  season,
}: {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  status: string;
  season?: any;
}) {
  const { handleAddCollection, handleUpdateCollection } =
    useContext(CollectionContext);
  const { dataProduct } = useContext(FilterProductContext);
  const [text, setText] = useState("");
  const [filteredSeason, setFilteredSeason] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    id:
      status === "edit" && season
        ? season.id
        : uuid(),
    slug: status === "edit" ? season.slug : "",
    name: status === "edit"? season.name : "",
    slogan: status === "edit"  ? season.slogan : "",
    description: status === "edit"  ? season.description : "",
    banner: status === "edit"  ? season.banner : "",
    seasonalAttributes:
      status === "edit" && season
        ? season.seasonalAttributes
        : {
            colors: [],
            materials: [],
            mood: "",
            temperature: "",
          },
    products: status === "edit" ? season.products : selectedProducts.map((p) => p.id),
    active: status === "edit"  ? season.active : true,
    rate: status === "edit" ? season.rate : 0,
    views: status === "edit"  ? season.views : 0,
  });

  const filteredList = dataProduct?.filter((product) => {
    const matchName = product.name.toLowerCase().includes(text.toLowerCase());
    const matchSeason = !filteredSeason || product.season === filteredSeason;
    return matchName && matchSeason;
  });
  const handleSelectProduct = (product: any) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
      setForm((prev) => ({
        ...prev,
        products: prev.products.filter((id: string) => id !== product.id),
      }));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
      setForm((prev) => ({
        ...prev,
        products: [...prev.products, {id: product.id}],
      }));
    }
  };

  const handleRemoveProduct = (product: any) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const clearAll = () => setSelectedProducts([]);

  const handleSubmit = () => {
    if (status === "edit") {
      handleUpdateCollection(form);
      setState(false);
      console.log(form);
      console.log(selectedProducts)
    } else {
      handleAddCollection(form);
      setState(false);
      console.log(form);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttrChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      seasonalAttributes: { ...prev.seasonalAttributes, [field]: value },
    }));
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center relative  p-8 ">
      <X
        onClick={() => setState(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
      />

      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-9 w-full max-w-7xl h-screen overflow-y-auto border text-black border-white/20 transition-all duration-500 hover:shadow-purple-200/50">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🌸</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {status === "edit" ? "Chỉnh Sửa Bộ Sưu Tập" : "Thêm Bộ Sưu Tập Mới"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {status === "edit"
              ? "Cập nhật thông tin bộ sưu tập của bạn bên dưới."
              : "Điền thông tin chi tiết về bộ sưu tập mới của bạn bên dưới."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Slug
                </label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="spring-collection-2025"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Tên mùa
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Xuân Hè 2025"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <input
              name="slogan"
              value={form.slogan}
              onChange={handleChange}
              placeholder="Nở rộ cùng sắc xuân..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-pink-500 outline-none"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả chi tiết về bộ sưu tập..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-indigo-500 outline-none resize-none"
            />

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Banner URL
              </label>
              <input
                name="banner"
                value={form.banner}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-orange-500 outline-none"
              />
              {form.banner && (
                <div className="mt-3 rounded-2xl overflow-hidden border">
                  <img
                    src={form.banner}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                🎨 Thuộc tính mùa
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.seasonalAttributes.colors.join(", ")}
                  onChange={(e) =>
                    handleAttrChange(
                      "colors",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Màu sắc..."
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                />
                <input
                  value={form.seasonalAttributes.materials.join(", ")}
                  onChange={(e) =>
                    handleAttrChange(
                      "materials",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Chất liệu..."
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                />
                <input
                  value={form.seasonalAttributes.mood}
                  onChange={(e) => handleAttrChange("mood", e.target.value)}
                  placeholder="Tâm trạng..."
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                />
                <input
                  value={form.seasonalAttributes.temperature}
                  onChange={(e) =>
                    handleAttrChange("temperature", e.target.value)
                  }
                  placeholder="Nhiệt độ..."
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <h1 className="font-semibold text-lg mb-2">Chọn sản phẩm</h1>
            <input
              onChange={(e) => setText(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 mb-3 focus:border-orange-500 outline-none"
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from(
                new Set(dataProduct?.map((p) => p.season).filter(Boolean))
              ).map((season, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setFilteredSeason(season === filteredSeason ? "" : season)
                  }
                  className={`px-4 py-1 rounded-lg text-sm ${
                    filteredSeason === season
                      ? "bg-fuchsia-600 text-white"
                      : "bg-fuchsia-100 text-fuchsia-700"
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>

            <ul className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-white/70 shadow-inner max-h-[400px]">
              {filteredList?.map((product: any) => {
                const isSelected = selectedProducts.find(
                  (p) =>
                    p.id === (status === "edit" ? form.products : product.id)
                );
                return (
                  <li
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`flex justify-between items-center border-b border-gray-200 py-2 px-2 text-sm rounded cursor-pointer ${
                      isSelected
                        ? "bg-green-50 hover:bg-green-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span>
                      {product.name} - {product.price}₫{" "}
                      <span className="text-gray-400 text-xs">
                        ({product.season || "Không có"})
                      </span>
                    </span>
                    {isSelected && (
                      <XCircleIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProduct(product);
                        }}
                        className="text-red-500 w-4 h-4"
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            {selectedProducts.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">
                    Đã chọn ({selectedProducts.length})
                  </h3>
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {status === "edit"
                    ? dataProduct
                        .filter((p) =>
                          selectedProducts.find((sp) => sp.id === p.id)
                        )
                        .map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleRemoveProduct(p)}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm cursor-pointer hover:border-red-400"
                          >
                            <img
                              src={p.thumbnail}
                              alt={p.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <span className="text-sm">{p.name}</span>
                            <X className="w-4 h-4 text-red-500" />
                          </div>
                        ))
                    : selectedProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleRemoveProduct(p)}
                          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm cursor-pointer hover:border-red-400"
                        >
                          <img
                            src={p.thumbnail}
                            alt={p.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <span className="text-sm">{p.name}</span>
                          <X className="w-4 h-4 text-red-500" />
                        </div>
                      ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="mt-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-pink-700 transition-all shadow-md"
            >
              {status === "edit" ? "Cập Nhật Bộ Sưu Tập" : "Thêm Bộ Sưu Tập"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
