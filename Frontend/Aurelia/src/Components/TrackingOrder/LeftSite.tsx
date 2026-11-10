import React from "react";
import { Package, MapPin, Store } from "lucide-react";

export type LeftSites = {
  data: any;
  onOpenMap?: () => void;
};

const LeftSite: React.FC<LeftSites> = ({ data, onOpenMap }) => {
  return (
    <div className="py-6 lg:py-20 bg-slate-50 lg:max-h-screen lg:overflow-y-scroll">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        <div className="bg-white rounded-3xl shadow-md p-6 lg:p-8 border border-slate-100">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
              Thông Tin Đơn Hàng
            </h2>
          </div>
          <p className="text-slate-500 ml-14 text-sm">
            Thông tin chi tiết về đơn hàng
          </p>
        </div>

        <div className="space-y-6">
          {data?.data?.product?.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-5 border border-slate-200"
            >
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={item.thumnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-white px-2 py-0.5 rounded-full text-xs font-semibold text-blue-600 shadow">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-base font-semibold text-slate-800">
                    {item.name}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-slate-400 uppercase text-xs">Màu</p>
                      <p className="font-medium">{item.color}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 uppercase text-xs">Size</p>
                      <p className="font-medium">{item.size}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 uppercase text-xs">SL</p>
                      <p className="font-medium">x{item.quantity}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex flex-wrap gap-4 text-sm">
                    <span className="font-semibold text-blue-600">
                      {item.price}
                    </span>
                    <span className="text-slate-500">
                      {new Date(
                        Number(item.dateBuy)
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 space-y-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-xl shadow-md">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold">Thông Tin Cửa Hàng</h2>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border">
            <p className="text-xs uppercase text-slate-500">Cửa hàng</p>
            <p className="font-semibold">{data?.shopName}</p>
            <p className="flex gap-2 text-sm text-slate-600 mt-1">
              <MapPin className="w-4 h-4 mt-0.5" />
              {data?.address}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
            <p className="text-xs uppercase opacity-90">Giao tới</p>
            <p className="text-lg font-bold">{data?.data?.name}</p>
            <p className="text-sm opacity-90">{data?.data?.address}</p>
          </div>
        </div>

        <button
          onClick={onOpenMap}
          className="lg:hidden w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md"
        >
          Xem bản đồ giao hàng
        </button>
      </div>
    </div>
  );
};

export default LeftSite;
