import { useContext, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
  Star,
  Grid,
  List,
} from "lucide-react";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { Export } from "./ProductListComponents/Export";
import { AddProduct } from "./ProductListComponents/AddProduct";
import { SplitFlap, SegmentMeter } from "../UI";
import type { Product } from "../../types/type";

interface ShopInventoryProduct {
  productId: string;
  sold: number;
}

const ProductList = () => {
  const { datasanPham } = useContext(DashBoardShopCOntext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [popUpAddProduct, setPopUpAddProduct] = useState(false);
  const [idProduct, setIdProduct] = useState("");

  const filteredProducts = datasanPham?.danhSachSanPham?.filter(
    (p: Product) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === "all" || p.type === filterType;
      return matchSearch && matchType;
    }
  );

  const [title, setTitle] = useState("Thêm Sản Phẩm Mới");
  const totalProducts = datasanPham?.tongSanPham ?? 0;
  const totalValue = datasanPham?.tongGiaTriKho ?? 0;
  const totalSold =
    datasanPham?.shopData?.products?.reduce(
      (sum: number, p: ShopInventoryProduct) => sum + p.sold,
      0
    ) ?? 0;
  const avgRating = datasanPham?.danhSachSanPham?.length
    ? (
        datasanPham.danhSachSanPham.reduce(
          (sum: number, p: Product) => sum + p.rating,
          0
        ) / datasanPham.danhSachSanPham.length
      ).toFixed(1)
    : "0.0";

  const sold = (id: string) => {
    let sl = 0;
    datasanPham?.shopData?.products?.forEach((p: ShopInventoryProduct) => {
      if (p.productId === id) {
        sl = p.sold;
      }
    });
    return sl;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const uniqueTypes: string[] =
    datasanPham?.danhSachSanPham?.reduce((types: string[], p: Product) => {
      if (!types.includes(p.type)) types.push(p.type);
      return types;
    }, []) || [];

  return (
    <>
      {popUpAddProduct ? (
        <div className="w-full h-screen fixed inset-0 flex items-center justify-center z-50 bg-[var(--color-ink)]/70">
          <AddProduct
            title={title}
            onClose={setPopUpAddProduct}
            dataEdit={filteredProducts || []}
            ProductId={idProduct}
            sold={
              datasanPham?.shopData?.products?.find(
                (p: ShopInventoryProduct) => p.productId === idProduct
              )?.sold || 0
            }
          />
        </div>
      ) : null}

      <div className="min-h-screen bg-[var(--color-bone)] p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)]">
          <div>
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
              [CONTROL ROOM // INVENTORY]
            </span>
            <h1 className="display-l font-display-safe text-[var(--color-ink)] mt-2">
              Quản Lý Sản Phẩm
            </h1>
            <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
              Tối ưu hóa và theo dõi toàn bộ sản phẩm
            </p>
          </div>
          <div className="flex gap-3">
            <Export Data={datasanPham?.shopData?.products} />
            <button
              onClick={() => {
                setPopUpAddProduct(true);
                setTitle("Thêm Sản Phẩm Mới");
              }}
              className="min-h-[48px] px-5 py-2.5 bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] mono-label font-extrabold flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm Sản Phẩm
            </button>
          </div>
        </div>

        {/* Scoreboard KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Tổng Sản Phẩm",
              val: String(totalProducts),
              icon: Package,
            },
            {
              label: "Giá Trị Kho",
              val: `${(totalValue / 1000000).toFixed(1)}M`,
              icon: DollarSign,
            },
            { label: "Đã Bán", val: String(totalSold), icon: TrendingUp },
            { label: "Đánh Giá TB", val: String(avgRating), icon: Star },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-[var(--color-paper)] p-5 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] space-y-3"
            >
              <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--color-ink)] pb-2">
                <p className="mono-label text-[var(--color-ink-muted)]">
                  {kpi.label}
                </p>
                <div className="w-9 h-9 bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center">
                  <kpi.icon className="w-4 h-4" />
                </div>
              </div>
              <SplitFlap value={kpi.val} size="sm" />
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-[var(--color-paper)] p-4 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] font-mono text-xs focus:outline-none focus:bg-[var(--color-paper)]"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="min-h-[44px] px-4 py-2 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] mono-label text-[var(--color-ink)] focus:outline-none"
              >
                <option value="all">Tất cả loại</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <div className="flex border-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`min-w-[44px] min-h-[40px] flex items-center justify-center cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[var(--color-volt)] text-[var(--color-ink)]"
                      : "text-[var(--color-ink-muted)]"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`min-w-[44px] min-h-[40px] flex items-center justify-center border-l-2 border-[var(--color-ink)] cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[var(--color-volt)] text-[var(--color-ink)]"
                      : "text-[var(--color-ink-muted)]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts?.map((product: Product) => (
              <div
                key={product.id}
                className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] overflow-hidden flex flex-col justify-between"
              >
                <div className="relative overflow-hidden bg-[var(--color-bone)] border-b-2 border-[var(--color-ink)]">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] px-2 py-0.5 flex items-center gap-1 mono-label font-extrabold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label text-[10px]">
                      {product.type}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-display-safe font-extrabold uppercase text-sm text-[var(--color-ink)] line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                      {product.brand}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-mono text-base font-extrabold text-[var(--color-flash)] tabular-nums">
                      {formatPrice(product.price)}
                    </p>
                    <span className="mono-label text-[10px] text-[var(--color-ink)]">
                      KHO: {product.stock}
                    </span>
                  </div>

                  {/* 10-segment stock bar */}
                  <SegmentMeter
                    value={product.stock}
                    max={100}
                    segments={10}
                    accent={product.stock > 20 ? "volt" : "flash"}
                    showValue={false}
                  />

                  <div className="grid grid-cols-2 gap-2 mono-label text-[10px]">
                    <div className="bg-[var(--color-bone)] border border-[var(--color-ink)] p-2">
                      <p className="text-[var(--color-ink-muted)]">Đã bán</p>
                      <p className="font-extrabold text-[var(--color-ink)]">
                        {sold(product.id)}
                      </p>
                    </div>
                    <div className="bg-[var(--color-bone)] border border-[var(--color-ink)] p-2">
                      <p className="text-[var(--color-ink-muted)]">Xuất xứ</p>
                      <p className="font-extrabold text-[var(--color-ink)] truncate">
                        {product.origin}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setTitle("Sửa Sản Phẩm");
                        setPopUpAddProduct(true);
                        setIdProduct(product.id);
                      }}
                      className="flex-1 min-h-[40px] px-3 py-2 bg-[var(--color-ink)] hover:bg-[var(--color-volt)] text-[var(--color-paper)] hover:text-[var(--color-ink)] border-2 border-[var(--color-ink)] mono-label font-extrabold transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                      Sửa
                    </button>
                    <button className="min-w-[40px] min-h-[40px] flex items-center justify-center bg-[var(--color-bone)] hover:bg-[var(--color-danger)] hover:text-[var(--color-paper)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[var(--color-ink)] text-[var(--color-paper)] border-b-2 border-[var(--color-ink)]">
                    <th className="px-4 py-3 text-left mono-label">Sản Phẩm</th>
                    <th className="px-4 py-3 text-left mono-label">Loại</th>
                    <th className="px-4 py-3 text-left mono-label">Giá</th>
                    <th className="px-4 py-3 text-left mono-label">Tồn Kho</th>
                    <th className="px-4 py-3 text-left mono-label">Đã Bán</th>
                    <th className="px-4 py-3 text-left mono-label">Rating</th>
                    <th className="px-4 py-3 text-center mono-label">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[var(--color-ink)]">
                  {filteredProducts?.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[var(--color-bone)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-12 h-12 object-cover border-2 border-[var(--color-ink)]"
                          />
                          <div>
                            <p className="font-display-safe font-extrabold text-xs uppercase text-[var(--color-ink)] line-clamp-1">
                              {product.name}
                            </p>
                            <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-[var(--color-bone)] border border-[var(--color-ink)] mono-label text-[10px]">
                          {product.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-extrabold text-[var(--color-flash)] tabular-nums">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3 w-40">
                        <SegmentMeter
                          value={product.stock}
                          max={100}
                          segments={10}
                          accent={product.stock > 20 ? "volt" : "flash"}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--color-ink)] tabular-nums">
                        {sold(product.id)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 font-mono text-xs font-extrabold">
                          <Star className="w-3.5 h-3.5 text-[var(--color-flash)] fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-2 border border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-volt)] cursor-pointer">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setTitle("Sửa Sản Phẩm");
                              setPopUpAddProduct(true);
                              setIdProduct(product.id);
                            }}
                            className="p-2 border border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-volt)] cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 border border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-danger)] hover:text-[var(--color-paper)] cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredProducts?.length === 0 && (
          <div className="bg-[var(--color-paper)] border-2 border-dashed border-[var(--color-ink)] p-14 text-center">
            <div className="w-16 h-16 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-[var(--color-ink)]" />
            </div>
            <h3 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)] mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="font-mono text-xs text-[var(--color-ink-muted)] mb-5">
              Thử điều chỉnh bộ lọc hoặc thêm sản phẩm mới vào hệ thống
            </p>
            <button
              onClick={() => {
                setPopUpAddProduct(true);
                setTitle("Thêm Sản Phẩm Mới");
              }}
              className="min-h-[44px] px-6 py-2.5 bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] mono-label font-extrabold cursor-pointer"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Thêm Sản Phẩm Đầu Tiên
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
