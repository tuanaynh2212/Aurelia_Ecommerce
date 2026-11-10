
import { useContext, useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Grid,
  List,
  Filter,
  ArrowRight,
  File,
  Star,
} from "lucide-react";
import { FilterProductContext } from "../../../contexts/FIlterProduct";
import ImportExcel from "./ProductManagementComponents/ImportExcel";
import { AddProduct } from "../../DashBoardShopComponent/ProductListComponents/AddProduct";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_Config, UseApiUrl } from "../../../services/api";
import { Toaster } from "../../Toaster";
import { CartContext } from "../../../contexts/CartContext";

export default function ProductManagement() {
  const { dataProduct } = useContext(FilterProductContext);
  const {formatPrice}=useContext(CartContext)
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [, setActiveAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState<boolean>(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);

  const filteredProducts = useMemo(() => {
    return dataProduct?.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [dataProduct, searchTerm]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(
        `${UseApiUrl(api_Config.Product.DeleteProduct)}?productId=${productId}`,
      );
      Toaster.success("Đã xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Error deleting product:", error);
      Toaster.error("Không thể xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  return (
    <div className="h-[110vh]  text-gray-900 p-3 sm:p-8 relative overflow-y-scroll">
      {editProduct && (
        <AddProduct
          onClose={setEditProduct}
          dataEdit={filteredProducts}
          ProductId={dataEdit?.id}
          sold={dataEdit?.sold}
          title="Sửa Sản Phẩm"
        />
      )}
      {openImportModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-20">
          <ImportExcel setOpenImportModal={setOpenImportModal} />
        </div>
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-rose-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-12  p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl sm:text-5xl   serif">
                  Products
                </h1>
              </div>
              <p className="text-gray-600 text-base sm:text-lg">
                Refined. Reactive. Radiant.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveAddProduct(true)}
                className="px-6 py-3 sm:px-8 sm:py-4  text-black shadow-2xl text-lg flex items-center gap-3 hover:scale-105 transition"
              >
                <Plus className="w-6 h-6" />
                Add Product
              </button>

              <button
                onClick={() => setOpenImportModal(true)}
                className="px-6 py-3  text-black shadow-2xl text-lg flex items-center gap-3 hover:scale-105 transition"
              >
                Import <File className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-gray-300 rounded-xl focus:outline-none text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="flex gap-2 items-center">
              <button className="p-3 bg-gray-100 border border-gray-200 rounded-xl">
                <Filter className="w-5 h-5 text-gray-700" />
              </button>

              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg ${
                    viewMode === "list"
                      ? "bg-black text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`grid gap-8 pb-10 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredProducts?.map((p) => (
            <div
              key={p.id}
              className="group relative animate-[fadeInUp_0.6s_ease-out]"
            >
              <div className="relative h-[420px] sm:h-[460px] md:h-[500px] bg-white border border-gray-200  overflow-hidden hover:border-purple-400 transition shadow-sm">
                <div className="absolute inset-0">
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/40 to-transparent" />
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => {
                      setEditProduct(true);
                      setDataEdit(p);
                    }}
                    className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300"
                  >
                    <Edit className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300"
                  >
                    <Trash2 className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <div className="absolute bottom-0 p-6 sm:p-8 z-10">
                  <span className="inline-block mb-3 px-4 py-1.5 bg-gray-100 border border-gray-300 rounded-full text-xs font-bold ">
                    {p.type.toUpperCase()}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-2 text-white">
                    {p.name}
                  </h3>

                  <p className="text-gray-200 text-sm line-clamp-2 mb-3">
                    {p.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white serif">
                      {formatPrice?.(p.price)}
                    </span>

                    <div className="flex text-yellow-400">
                      {Array.from({ length: Math.round(p.rating || 4) }).map(
                        (_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ),
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-200">
                    <span>Stock: {p.stock}</span>
                    <span>Sold: {p.sold}</span>

                    {p.discountValue > 0 && (
                      <span className="text-rose-300 font-bold">
                        -{p.discountValue}
                        {p.discountType === "percent" ? "%" : "$"}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/Fashion/Products/${p.id}`)}
                    className="w-full mt-5 px-6 py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                  >
                    View Details <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="group cursor-pointer">
            <div
              onClick={() => setActiveAddProduct(true)}
              className="h-[420px] sm:h-[460px] md:h-[500px] bg-white border-2 border-dashed border-gray-300 rounded-3xl hover:bg-gray-100 hover:border-purple-400 transition flex flex-col items-center justify-center gap-6 shadow-sm"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-rose-300 rounded-3xl blur-xl opacity-50 group-hover:opacity-100"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-rose-400 rounded-3xl flex items-center justify-center">
                  <Plus className="w-10 h-10 text-white" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black">Add Product</h3>
              <p className="text-gray-500 text-sm">Create a new item</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
