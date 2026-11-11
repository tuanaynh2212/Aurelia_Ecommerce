import { X, CreditCard, Calendar, Lock, User } from "lucide-react";
import { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../LoadingOverlay";
import { Canvas } from "@react-three/fiber";
import { StudioLights } from "../UI/three/StudioLights";
import { PrinterTicket } from "../UI/three/PrinterTicket";

export const CreditCardPayment = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleClickPayment, setCartDataAdd, dataOrder } =
    useContext(CartContext);
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
    <div className="min-h-screen bg-[var(--color-bone)] text-[var(--color-ink)] flex items-center justify-center p-4 md:p-8">
      <LoadingOverlay isLoading={loading} message="Đang xử lý thanh toán..." />
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* 7-col PrinterTicket 3D Scene */}
        <div className="lg:col-span-7 min-h-[380px] border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-[var(--shadow-hard-lg)] relative overflow-hidden">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
              [CASHIER-PRINTER // CARD TERMINAL]
            </span>
            <span className="hud-chip bg-[var(--color-paper)] text-[var(--color-ink)]">
              {loading ? "PRINTING RECEIPT..." : "READY"}
            </span>
          </div>
          <Canvas camera={{ position: [0, 0.5, 4.2], fov: 42 }}>
            <StudioLights />
            <PrinterTicket
              status={loading ? "processing" : "success"}
              orderCode={dataOrder?.orderId?.slice(0, 8).toUpperCase() || "CARD-01"}
              totalText={loading ? "AUTHORIZING..." : "VERIFIED TERMINAL"}
            />
          </Canvas>
        </div>

        {/* 5-col Brutalist Card Terminal Panel */}
        <div className="lg:col-span-5 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] flex flex-col justify-between">
          <div className="flex justify-between items-center p-5 border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-[var(--color-volt)] text-[var(--color-ink)] mono-label font-extrabold">
                POS-01
              </span>
              <h2 className="font-display-safe font-extrabold text-sm uppercase tracking-wider">
                Credit / Debit Card
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-flash)] hover:text-[var(--color-paper)] border-2 border-[var(--color-ink)] transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-4 flex-1">
            <div>
              <label className="block mono-label text-[var(--color-ink)] mb-1">
                CARD NUMBER
              </label>
              <div className="flex items-center border-2 border-[var(--color-ink)] bg-[var(--color-bone)] px-3 min-h-[48px] focus-within:bg-[var(--color-paper)] focus-within:shadow-[var(--shadow-hard-sm)]">
                <CreditCard className="h-4 w-4 text-[var(--color-flash)] mr-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full outline-none bg-transparent font-mono text-xs text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mono-label text-[var(--color-ink)] mb-1">
                  EXPIRY
                </label>
                <div className="flex items-center border-2 border-[var(--color-ink)] bg-[var(--color-bone)] px-3 min-h-[48px] focus-within:bg-[var(--color-paper)] focus-within:shadow-[var(--shadow-hard-sm)]">
                  <Calendar className="h-4 w-4 text-[var(--color-flash)] mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full outline-none bg-transparent font-mono text-xs text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
                  />
                </div>
              </div>
              <div>
                <label className="block mono-label text-[var(--color-ink)] mb-1">
                  CVV / CVC
                </label>
                <div className="flex items-center border-2 border-[var(--color-ink)] bg-[var(--color-bone)] px-3 min-h-[48px] focus-within:bg-[var(--color-paper)] focus-within:shadow-[var(--shadow-hard-sm)]">
                  <Lock className="h-4 w-4 text-[var(--color-flash)] mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full outline-none bg-transparent font-mono text-xs text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mono-label text-[var(--color-ink)] mb-1">
                CARDHOLDER NAME
              </label>
              <div className="flex items-center border-2 border-[var(--color-ink)] bg-[var(--color-bone)] px-3 min-h-[48px] focus-within:bg-[var(--color-paper)] focus-within:shadow-[var(--shadow-hard-sm)]">
                <User className="h-4 w-4 text-[var(--color-flash)] mr-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="NGUYEN VAN A"
                  className="w-full outline-none bg-transparent font-mono text-xs uppercase text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
                />
              </div>
            </div>
          </div>

          <div className="p-5 border-t-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
            <button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="w-full min-h-[52px] border-2 border-[var(--color-ink)] bg-[var(--color-flash)] text-[var(--color-paper)] shadow-[var(--shadow-hard)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[var(--shadow-hard-lg)] disabled:opacity-50 disabled:cursor-not-allowed font-mono font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              {loading ? "Đang xử lý..." : "Pay Now · Xác Nhận Thanh Toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
