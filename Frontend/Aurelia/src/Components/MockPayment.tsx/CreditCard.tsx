import { X, CreditCard, Calendar, Lock, User } from "lucide-react";
import { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../LoadingOverlay";

export const CreditCardPayment = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleClickPayment, setCartDataAdd } = useContext(CartContext);
  const handlePay = () => {
    setLoading(true);
    handleClickPayment();
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1500);
    setCartDataAdd([]);
  };
  return (
    <div>
      <LoadingOverlay isLoading={loading} message="Đang xử lý thanh toán..." />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
          <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-emerald-500 to-teal-500">
            <div className="flex items-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                className="h-5 drop-shadow-sm"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-5 drop-shadow-sm"
              />
              <h2 className="text-white font-semibold ml-2">
                Credit / Debit Card
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center border rounded-xl px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500">
              <CreditCard className="h-5 w-5 text-emerald-500 mr-2" />
              <input
                type="text"
                placeholder="Card Number"
                className="w-full outline-none text-sm placeholder-gray-400"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center border rounded-xl px-3 py-3 w-1/2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500">
                <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full outline-none text-sm placeholder-gray-400"
                />
              </div>
              <div className="flex items-center border rounded-xl px-3 py-3 w-1/2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500">
                <Lock className="h-5 w-5 text-emerald-500 mr-2" />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-full outline-none text-sm placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center border rounded-xl px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500">
              <User className="h-5 w-5 text-emerald-500 mr-2" />
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full outline-none text-sm placeholder-gray-400"
              />
            </div>
          </div>
          <div className="p-5 border-t bg-gray-50">
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-full font-semibold shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Đang xử lý..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
