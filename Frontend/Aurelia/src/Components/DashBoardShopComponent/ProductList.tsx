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

const ProductList = () => {
  const { datasanPham } = useContext(DashBoardShopCOntext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [popUpAddProduct, setPopUpAddProduct] = useState(false);
  const [idProduct, setIdProduct] = useState("");
  const filteredProducts = datasanPham?.danhSachSanPham?.filter((p: any) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || p.type === filterType;
    return matchSearch && matchType;
  });
  const [title, setTitle] = useState("Thêm Sản Phẩm Mới");
  const totalProducts = datasanPham?.tongSanPham;
  const totalValue = datasanPham?.tongGiaTriKho;
  const totalSold = datasanPham?.shopData?.products?.reduce(
    (sum: any, p: any) => sum + p.sold,
    0
  );
  const avgRating = (
    datasanPham?.danhSachSanPham?.reduce(
      (sum: any, p: any) => sum + p.rating,
      0
    ) / datasanPham?.danhSachSanPham?.length
  ).toFixed(1);
  const sold = (id: string) => {
    let sl = 0;
    datasanPham?.shopData?.products.forEach((p: any) => {
      if (p.productId === id) {
        sl = p.sold;
      }
    });
    return sl;
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <>
      {popUpAddProduct ? (
        <div className="w-full h-screen fixed inset-0 flex items-center justify-center z-100 bg-black/70">
          <AddProduct title={title} onClose={setPopUpAddProduct} dataEdit={filteredProducts} ProductId={idProduct} sold={datasanPham.shopData.products.find((p: any) => p.productId === idProduct)?.sold || 0} />
        </div>
      ) : (
        ""
      )}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
        <div className=" mx-auto p-8">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl serif text-gray-900 mb-3 tracking-tight">
                  Quản Lý Sản Phẩm
                </h1>
                <p className="text-lg text-gray-500">
                  Tối ưu hóa và theo dõi toàn bộ sản phẩm
                </p>
              </div>
              <div className="flex gap-3">
                <Export Data={datasanPham?.shopData?.products} />
                <button
                  onClick={() => {setPopUpAddProduct(true); setTitle("Thêm Sản Phẩm Mới")}}
                  className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-all font-medium flex items-center gap-2 shadow-lg shadow-gray-900/10"
                >
                  <Plus className="w-5 h-5" />
                  Thêm Sản Phẩm
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white  shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100  flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Tổng Sản Phẩm</p>
                <p className="text-3xl serif text-gray-900">
                  {totalProducts}
                </p>
              </div>

              <div className="bg-white  shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100  flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Giá Trị Kho</p>
                <p className="text-3xl serif text-gray-900">
                  {(totalValue / 1000000).toFixed(1)}M
                </p>
              </div>

              <div className="bg-white  shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100  flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Đã Bán</p>
                <p className="text-3xl serif text-gray-900">{totalSold}</p>
              </div>

              <div className="bg-white shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100  flex items-center justify-center">
                    <Star className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Đánh Giá TB</p>
                <p className="text-3xl serif text-gray-900">{avgRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white  shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-5 py-3 bg-gray-50 border border-gray-200  focus:outline-none focus:border-gray-400 font-medium text-gray-700"
                >
                  <option value="all">Tất cả loại</option>
                  {datasanPham?.danhSachSanPham
                    .reduce((types: any, p: any) => {
                      if (!types.includes(p.type)) types.push(p.type);
                      return types;
                    }, [])
                    .map((type: any) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                </select>

                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5  transition-all ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "hover:bg-white/50"
                    }`}
                  >
                    <Grid className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5  transition-all ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "hover:bg-white/50"
                    }`}
                  >
                    <List className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white  shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all  hover:-translate-y-1 group"
                >
                  <div className="relative overflow-hidden bg-gray-50">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="serif text-gray-900 text-sm">
                        {product.rating}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white rounded-full text-xs font-semibold shadow-lg">
                        {product.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className=" text-gray-900 mb-2 text-lg line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {product.name.length > 30
                        ? `${product.name.slice(0, 25)}...`
                        : product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {product.brand}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Tồn kho</p>
                        <p
                          className={`font-bold ${
                            product.stock > 50
                              ? "text-gray-900"
                              : product.stock > 20
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {product.stock}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-0.5">Đã bán</p>
                        <p className="font-bold text-gray-900">
                          {sold(product.id)}
                        </p>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-0.5">Xuất xứ</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {product.origin}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={()=>{setTitle("Sửa Sản Phẩm"); setPopUpAddProduct(true),setIdProduct(product.id)}} className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm">
                        <Edit2 className="w-4 h-4 inline mr-1" />
                        Sửa
                      </button>
                      <button className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Sản Phẩm
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tồn Kho
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Đã Bán
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao Tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts?.map((product: any) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-all"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                            />
                            <div>
                              <p className="font-bold text-gray-900">
                                {product.name.length > 50
                                  ? `${product.name.slice(0, 50)}...`
                                  : product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {product.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">
                            {product.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold">
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          {sold(product.id)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-900">
                              {product.rating}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                              <Trash2 className="w-5 h-5" />
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
            <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-500 mb-6">
                Thử điều chỉnh bộ lọc hoặc thêm sản phẩm mới vào hệ thống
              </p>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg shadow-gray-900/10">
                <Plus className="w-4 h-4 inline mr-2" />
                Thêm Sản Phẩm Đầu Tiên
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
