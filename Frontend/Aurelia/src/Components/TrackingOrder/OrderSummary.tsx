import { useContext } from "react";
import type { order } from "../../types/type";
import { CreditCardIcon, HomeIcon } from "lucide-react";
import { CartContext } from "../../contexts/CartContext";

export const OrderSummaryGrid = ({ data }: { data: order | undefined }) => {
  const {formatPrice}=useContext(CartContext)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="flex flex-col gap-4">
        <h4 className="font-serif text-xl font-bold text-[#111318]  pb-2 border-b border-[#dbdfe6] dark:border-gray-700">
          Shipping Details
        </h4>
        <div className="flex flex-col gap-1 text-sm text-[#616f89] dark:text-gray-300 leading-relaxed">
          <p className="font-bold text-[#111318]  text-base mb-1">
            {data?.address}
          </p>
          <p>{data?.address}, VN 5555451</p>
          <p>Viet Nam</p>
          <p className="mt-2">{data?.phone}</p>
        </div>
      </div>
      {
        data?.payment==="paypal" ? (
      <div className="flex flex-col gap-4">
        <h4 className="font-serif text-xl font-bold text-[#111318]  pb-2 border-b border-[#dbdfe6] dark:border-gray-700">
          Payment Method
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[#111318] ">
            {data?.payment==="paypal" ? <CreditCardIcon className="w-8 h-8 text-gray-500"/> : data?.payment==="cod" ? <HomeIcon className="w-8 h-8 text-gray-500"/> : <CreditCardIcon className="w-8 h-8 text-gray-500"/>}
            <div>
              <p className="text-sm font-bold">
                {data?.payment.toUpperCase()} ending in
              </p>
              <p className="text-xs text-[#616f89] dark:text-gray-400">
                Exp 12 / 26
              </p>
            </div>
          </div>
        </div>
      </div>):data?.payment==="card" ?(
        <div className="flex flex-col gap-4">
        <h4 className="font-serif text-xl font-bold text-[#111318]  pb-2 border-b border-[#dbdfe6] dark:border-gray-700">
            Payment Method
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[#111318] ">
            <CreditCardIcon className="w-8 h-8 text-gray-500"/>
            <div>
              <p className="text-sm font-bold">
                {data?.payment.toUpperCase()} ending in {""}
              </p>
              <p className="text-xs text-[#616f89] dark:text-gray-400">
                Exp 12 / 26
              </p>
            </div>
            </div>
        </div>
        </div>
        ):(
          <div className="flex flex-col gap-4">
          <h4 className="font-serif text-xl font-bold text-[#111318]  pb-2 border-b border-[#dbdfe6] dark:border-gray-700">
                Payment Method
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[#111318] dark:text-white">
                <HomeIcon className="w-8 h-8 text-gray-500"/>
                <div>
                  <p className="text-sm font-bold">
                    {data?.payment.toUpperCase()}
                    </p>
                </div>
                </div>
            </div>
            </div>
        )
      }

      <div className="flex flex-col gap-4">
        <h4 className="font-serif text-xl font-bold text-[#111318]  pb-2 border-b border-[#dbdfe6] dark:border-gray-700">
          Order Summary
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#616f89] dark:text-gray-400">Subtotal</span>
            <span className="font-medium text-[#111318] ">
              $
              {formatPrice?.(
                data?.product?.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0,
                ) ?? 0
              )}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#616f89] dark:text-gray-400">
              Shipping (Express)
            </span>
            <span className="font-medium text-[#111318] ">
              ${formatPrice?.(25000)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#616f89] dark:text-gray-400">
              Estimated Tax
            </span>
            <span className="font-medium text-[#111318] ">
              ${formatPrice?.(0.0)}
            </span>
          </div>
          <div className="h-px bg-[#dbdfe6] dark:bg-gray-700 my-1"></div>
          <div className="flex justify-between items-center text-lg font-bold text-[#111318] ">
            <span className="font-serif">Grand Total</span>
            <span>
              $
              {formatPrice?.(
                (data?.product?.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0,
                ) ?? 0) + 25000
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
