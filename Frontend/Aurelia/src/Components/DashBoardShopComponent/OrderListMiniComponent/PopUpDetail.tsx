import { Package, User, MapPin, Calendar, X } from "lucide-react";
import type { order } from "../../../types/type";

export const PopUpDetail = ({
  data,
  onClose,
  orderId,
}: {
  data: order[] | undefined;
  onClose: () => void;
  orderId: string;
}) => {
  const shop = localStorage.getItem("shop");
  const shopParsed = shop ? JSON.parse(shop) : null;
  const orderData = data?.filter((order) => order.orderId === orderId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 md:p-8 animate-fade-in-up overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold  mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Chi tiết đơn hàng
        </h2>

        {orderData?.map((order) => (
          <div
            key={order.orderId}
            className="border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-gray-800">
                  Mã đơn: #{order.orderId}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(order.ngayTaoDon).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Khách hàng</p>
                    <p className="font-medium text-gray-800">{order.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Địa chỉ nhận hàng</p>
                    <p className="text-sm text-gray-700">{order.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                    <p className="text-sm text-gray-700">
                      {shopParsed?.address}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                      order.status === "Đang giao"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Chờ xác nhận"
                        ? "bg-amber-100 text-amber-700"
                        : order.status === "Đã giao"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Danh sách sản phẩm
                </h3>
                {order.product.map((item) => (
                  <div
                    key={item.itemid}
                    className="border-b border-gray-200 pb-2 last:border-0"
                  >
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-600">
                      Màu: {item.color} • Size: {item.size}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">
                        SL: {item.quantity}
                      </span>
                      <span className="text-sm font-semibold text-indigo-600">
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
