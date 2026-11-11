import { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../LoadingOverlay";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { api_Config, UseApiUrl } from "../../services/api";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { StudioLights } from "../UI/three/StudioLights";
import { PrinterTicket } from "../UI/three/PrinterTicket";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const MockPayPal = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dataOrder, handleClickPayment, setCartDataAdd } =
    useContext(CartContext);
  const handlePay = async ({ orderId }: { orderId: string }) => {
    setLoading(true);
    const response = await axios.post(
      UseApiUrl(api_Config.User.PaypalPayment),
      {
        orderId: orderId,
        order: dataOrder,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status === 200) {
      handleClickPayment();
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 1500);
      setCartDataAdd([]);
    }
  };
  const totalAmount = dataOrder?.product?.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return (
    <div className="min-h-screen bg-[var(--color-bone)] text-[var(--color-ink)] flex items-center justify-center p-4 md:p-8">
      <LoadingOverlay isLoading={loading} message="Đang xử lý thanh toán..." />
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* 7-col PrinterTicket 3D Scene */}
        <div className="lg:col-span-7 min-h-[380px] border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-[var(--shadow-hard-lg)] relative overflow-hidden">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
              [CASHIER-PRINTER // PAYPAL GATEWAY]
            </span>
          </div>
          <Canvas camera={{ position: [0, 0.5, 4.2], fov: 42 }}>
            <StudioLights />
            <PrinterTicket
              status={loading ? "processing" : "success"}
              orderCode={dataOrder?.orderId?.slice(0, 8).toUpperCase() || "INTL-PP"}
              totalText={`USD ${(totalAmount || 0).toFixed(2)}`}
            />
          </Canvas>
        </div>

        {/* 5-col Confirmation & PayPal Panel */}
        <div className="lg:col-span-5 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-3 mb-4">
              <span className="mono-label text-[var(--color-flash)]">
                [INTERNATIONAL GATEWAY]
              </span>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="min-h-[36px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-volt)] inline-flex items-center gap-1.5 mono-label cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>QUAY LẠI</span>
              </button>
            </div>
            <h1 className="display-m font-display-safe text-[var(--color-ink)] mb-2">
              Cổng Thanh Toán Quốc Tế
            </h1>
            <p className="text-xs font-mono text-[var(--color-ink-muted)] mb-6">
              Xác thực giao dịch trực tiếp qua cổng PayPal quốc tế. Hóa đơn nhiệt sẽ được kích hoạt ngay sau khi duyệt lệnh.
            </p>

            <div className="p-4 border-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
              <PayPalScriptProvider
                options={{
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                  currency: "USD",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "black",
                    shape: "rect",
                    label: "paypal",
                  }}
                  createOrder={(_, actions) => {
                    const total = totalAmount || 0;

                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          description: `Thanh toán đơn hàng của ${dataOrder?.name || "Khách hàng"}`,
                          custom_id: dataOrder?.orderId?.toString() || "guest",
                          invoice_id: `INV_${Date.now()}`,
                          amount: {
                            currency_code: "USD",
                            value: total.toFixed(2),
                            breakdown: {
                              item_total: {
                                currency_code: "USD",
                                value: total.toFixed(2),
                              },
                            },
                          },
                          items: dataOrder?.product?.map((item) => ({
                            name: item.name,
                            unit_amount: {
                              currency_code: "USD",
                              value: item.price.toFixed(2),
                            },
                            quantity: item.quantity.toString(),
                          })),
                        },
                      ],
                    });
                  }}
                  onApprove={async (_, actions) => {
                    const order = await actions?.order?.capture();
                    await handlePay({ orderId: order?.id || "" });
                    setCartDataAdd([]);
                    navigate("/");
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>

          <div className="flex items-center gap-2 mono-label text-[var(--color-ink-muted)] border-t-2 border-[var(--color-ink)] pt-3">
            <ShieldCheck size={14} className="text-[var(--color-success)]" />
            <span>ENCRYPTED PAYPAL BRIDGE · ATELIER VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
