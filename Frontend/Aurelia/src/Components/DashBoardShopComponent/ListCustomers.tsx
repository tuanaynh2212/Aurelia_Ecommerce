import { useContext, useState } from "react";
import {
  Search,
  Star,
  Mail,
  Phone,
  TrendingUp,
  ShoppingBag,
  Award,
} from "lucide-react";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import { CartContext } from "../../contexts/CartContext";

export default function ListCustomer() {
  const [search, setSearch] = useState("");
  const {formatPrice}=useContext(CartContext)
  const { dataCustomer, totalCustomer, totaldoanhthu, avgchitieu } =
    useContext(DashBoardShopCOntext);

  const filtered = dataCustomer?.filter(
    (c) =>
      c?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 p-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl serif ">
              Khách hàng
            </h1>
            <p className="text-gray-600 text-sm">
              Quản lý hồ sơ và hành vi khách hàng của bạn
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: "Tổng khách hàng",
            value: totalCustomer,
            icon: Award,
          },
          {
            title: "Tổng doanh thu",
            value: `${formatPrice(totaldoanhthu)}`,
            icon: TrendingUp,
          },
          {
            title: "Trung bình / KH",
            value: `${formatPrice(avgchitieu)}`,
            icon: ShoppingBag,
          },
        ].map(({ title, value, icon: Icon }, i) => (
          <div
            key={i}
            className="relative bg-white  p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div
                className={`w-14 h-14 bg-black  flex items-center justify-center shadow-md`}
              >
                <Icon className="text-white" size={26} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="relative max-w-2xl mb-12">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm khách hàng theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-5 py-4 bg-white  border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered ? (
          filtered.map((c) => (
            <div
              key={c.id}
              className="group relative bg-white  p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <Star size={12} fill="white" />
                {c.tier}
              </div>

              <div className="flex items-center gap-4 mb-5">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-16 h-16 object-cover ring-4 ring-white shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {c.name}
                  </h2>
                  <p className="text-sm text-gray-500">ID: #{c.id}</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Mail size={16} className="text-indigo-600" />
                  </div>
                  <span className="text-sm">{c.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Phone size={16} className="text-purple-600" />
                  </div>
                  <span className="text-sm">
                    {c.thongTinDatHang.map((item: any) => item.soDT).join(", ")}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Tổng chi tiêu
                    </p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {c?.donHangCuaBan
                        ?.flatMap((d: any) => d.product)
                        ?.reduce(
                          (sum: number, item: any) =>
                            sum + item.price * item.quantity,
                          0
                        )
                        ?.toFixed(1)}
                      M₫
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Đơn hàng
                    </p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {c.donHangCuaBan.length}
                    </p>
                  </div>
                </div>

                <button className="w-full py-3  text-white  bg-black hover:opacity-90 transition-all shadow-md">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={36} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Không tìm thấy khách hàng
            </h3>
            <p className="text-gray-500">Hãy thử tìm bằng tên khác.</p>
          </div>
        )}
      </div>
    </div>
  );
}
