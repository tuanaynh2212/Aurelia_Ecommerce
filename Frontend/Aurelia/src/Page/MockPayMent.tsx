import { useNavigate, useParams } from "react-router-dom";
import { MockPayPal } from "../Components/MockPayment.tsx/Paypal";
import { CreditCardPayment } from "../Components/MockPayment.tsx/CreditCard";
import { Canvas } from "@react-three/fiber";
import { StudioLights } from "../Components/UI/three/StudioLights";
import { PrinterTicket } from "../Components/UI/three/PrinterTicket";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export const MockPayMent = () => {
  const { id } = useParams();
  let data: React.ReactNode = null;
  const navigate = useNavigate();
  const handleClickClose = () => {
    navigate(-1);
  };

  switch (id) {
    case "paypal":
      data = <MockPayPal />;
      break;
    case "card":
      data = <CreditCardPayment onClose={handleClickClose} />;
      break;
    case "cod":
      data = (
        <div className="min-h-screen bg-[var(--color-bone)] text-[var(--color-ink)] p-6 md:p-12 flex items-center justify-center">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 h-[420px] border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-[var(--shadow-hard-lg)] relative overflow-hidden">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
                  [CASHIER-PRINTER // COD]
                </span>
              </div>
              <Canvas camera={{ position: [0, 0.5, 4.2], fov: 42 }}>
                <StudioLights />
                <PrinterTicket
                  status="success"
                  orderCode="COD-VERIFIED"
                  totalText="SETTLED ON DELIVERY"
                />
              </Canvas>
            </div>
            <div className="lg:col-span-5 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] p-6 space-y-5">
              <div className="flex items-center gap-2 text-[var(--color-success)] mono-label">
                <CheckCircle2 size={16} />
                <span>[COD SETTLEMENT CONFIRMED]</span>
              </div>
              <h1 className="display-m font-display-safe text-[var(--color-ink)]">
                Thanh toán khi nhận hàng
              </h1>
              <p className="text-xs font-mono text-[var(--color-ink-muted)]">
                Phiếu xuất kho đã được in tại quầy thu ngân Atelier. Bạn sẽ thanh toán trực tiếp khi kiện hàng được bàn giao.
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full min-h-[48px] border-2 border-[var(--color-ink)] bg-[var(--color-flash)] text-[var(--color-paper)] shadow-[var(--shadow-hard)] mono-label font-extrabold cursor-pointer"
              >
                QUAY VỀ TRANG CHỦ
              </button>
            </div>
          </div>
        </div>
      );
      break;
    default:
      data = (
        <div className="min-h-screen bg-[var(--color-bone)] text-[var(--color-ink)] p-6 md:p-12 flex items-center justify-center">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 h-[420px] border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-[var(--shadow-hard-lg)] relative overflow-hidden">
              <Canvas camera={{ position: [0, 0.5, 4.2], fov: 42 }}>
                <StudioLights />
                <PrinterTicket
                  status="failure"
                  orderCode="ERR-GATEWAY"
                  totalText="INVALID METHOD"
                />
              </Canvas>
            </div>
            <div className="lg:col-span-5 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] p-6 space-y-4">
              <div className="flex items-center gap-2 text-[var(--color-danger)] mono-label">
                <AlertTriangle size={16} />
                <span>[GATEWAY ERROR]</span>
              </div>
              <p className="display-m font-display-safe text-[var(--color-ink)]">
                Không tìm thấy phương thức thanh toán
              </p>
              <button
                type="button"
                onClick={handleClickClose}
                className="min-h-[48px] px-6 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] inline-flex items-center gap-2 mono-label cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>QUAY LẠI</span>
              </button>
            </div>
          </div>
        </div>
      );
      break;
  }

  return <>{data}</>;
};
