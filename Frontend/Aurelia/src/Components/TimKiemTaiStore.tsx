import { X } from "lucide-react";
import React, { useContext, type SetStateAction, useState } from "react";
import type { Product } from "../types/type";
import { StoreContext } from "../contexts/Store";
import { useNavigate } from "react-router-dom";

type ProductFindProps = {
  product: Product;
  setState: React.Dispatch<SetStateAction<boolean>>;
};

export const TimKiemTaiStore: React.FC<ProductFindProps> = ({
  product,
  setState,
}) => {
  const { GetStore, dataStore,setAppointmentProduct } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    GetStore(product.id, size.toUpperCase());
  };
  const navigate=useNavigate()
  const handleClickAppointment=(item:Product,shopId:string)=>{
    navigate(`/BookingAppointment/${shopId}`)
    setAppointmentProduct({
      id:item.id,
      thumbnail:item.images[1],
      name:item.name,
      size:selectedSize??"",
      price:item.price
    });
  }

  return (
    <div className="w-full h-screen z-[9999] bg-white fixed md:top-0 md:left-0  overflow-y-auto">
      <div className="flex justify-between items-center p-5 border-b border-gray-300">
        <h1 className="text-lg font-semibold">Tìm Kiếm Tại Store</h1>
        <X
          className="cursor-pointer hover:text-red-500 transition"
          onClick={() => setState(false)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="flex flex-col items-center gap-3">
          <img
            src={product.images[1]}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          <h1 className="text-xl font-semibold text-center">{product.name}</h1>
          <h2 className="text-gray-500">{product.brand}</h2>
          <h3 className="text-lg text-green-600 font-bold">{product.price}</h3>
        </div>

        <div className="md:col-span-2 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="font-medium mb-3">
              Hãy chọn một size để tìm kiếm cửa hàng
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {product.variants.flatMap((variant) =>
                variant.sizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => handleSelectSize(size.size)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedSize === size.size
                        ? "bg-black text-white border-black"
                        : "border-gray-400 hover:bg-black hover:text-white"
                    }`}
                  >
                    {size.size}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="w-full mt-6">
            <h1 className="text-lg font-bold mb-3 w-full text-center">Boutiques</h1>
            <div className="h-0.5 w-full bg-gray-500 mb-4"></div>
            {dataStore.length === 0 ? (
              <p className="text-gray-500 text-center">
                Vui lòng chọn size để tìm kiếm cửa hàng.
              </p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {dataStore.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 border rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h1 className="font-semibold">{item.shopName}</h1>
                      <span className="text-sm text-red-500">Limited stock</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>{item.address}</p>
                      <p>{item.city}</p>
                      <p>☎ {item.phone}</p>
                      <p>Owner: {item.owner}</p>
                    </div>
                    <p className="mt-2 text-black text-sm">⏰ Open: {item.openingHours}</p>
                    <div className="mt-3">
                      <button onClick={()=>handleClickAppointment(product,item.shopId)} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                        Đặt Lịch Hẹn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
