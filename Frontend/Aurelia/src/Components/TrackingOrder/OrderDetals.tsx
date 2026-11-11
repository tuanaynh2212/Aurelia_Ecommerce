import { ArrowRight, ReceiptText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { order } from "../../types/type";
import { api_Config, UseApiUrl } from "../../services/api";
import { api_Response } from "../../services/http";
import { formatDateOnly } from "../../utils/formatters";
import { OrderSummaryGrid } from "./OrderSummary";
import { OrderItemsTable } from "./OrderItemsTable";
import { OrderTimeline } from "./OrderTimeLine";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import { Footer } from "../HomeLayoutComponent/Footer";
import { Badge } from "../UI";

interface OrderDetailResponse {
  data?: order;
}

const ESTIMATED_DELIVERY_OFFSET_MS = 7 * 24 * 60 * 60 * 1000;

export const OrderDetals = () => {
  const { id } = useParams();
  const [data, setData] = useState<OrderDetailResponse>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await api_Response<OrderDetailResponse>(
          `${UseApiUrl(api_Config.Shop.LayDonHangTheoID)}?id=${id}`,
          "GET"
        );
        setData(res);
      } catch {
        setData(undefined);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="min-h-screen bg-[var(--color-bone)]/85 text-[var(--color-ink)] flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <OrderHeader order={data?.data} />
        <OrderTimeline data={data?.data} />
        <OrderItemsTable data={data?.data?.product} />
        <OrderSummaryGrid data={data?.data} />
        <FooterActions navigate={navigate} id={data?.data?.orderId ?? ""} />
      </main>
      <Footer />
    </div>
  );
};

const OrderHeader: React.FC<{ order: order | undefined }> = ({ order }) => {
  const orderId = order?.orderId ?? "";
  const estimatedDate = formatDateOnly(
    new Date(Date.now() + ESTIMATED_DELIVERY_OFFSET_MS)
  );

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)]">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
            [ORDER DOSSIER]
          </span>
          <Badge status="info">{order?.status || "PROCESSING"}</Badge>
        </div>
        <h2 className="display-l font-display-safe text-[var(--color-ink)]">
          Order #{orderId.length > 8 ? orderId.slice(0, 8) : orderId}
        </h2>
        <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
          Placed on {order?.ngayTaoDon} · Estimated Delivery: {estimatedDate}
        </p>
      </div>
      <div className="flex gap-3">
        <button className="min-h-[44px] px-5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] text-[var(--color-ink)] mono-label font-extrabold flex items-center gap-2 transition-colors cursor-pointer">
          <ReceiptText className="w-4 h-4" />
          Invoice
        </button>
        <button className="min-h-[44px] px-5 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-volt)] text-[var(--color-ink)] mono-label font-extrabold transition-colors cursor-pointer">
          Need Help?
        </button>
      </div>
    </div>
  );
};

const FooterActions: React.FC<{
  navigate: (id: string) => void;
  id: string;
}> = ({ navigate, id }) => (
  <div className="flex justify-end gap-4 border-t-2 border-[var(--color-ink)] pt-6">
    <button
      onClick={() => navigate("/tracking/" + id)}
      className="min-h-[52px] px-8 border-2 border-[var(--color-ink)] bg-[var(--color-flash)] text-[var(--color-paper)] shadow-[var(--shadow-hard)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[var(--shadow-hard-lg)] mono-label font-extrabold transition-all flex items-center gap-2 cursor-pointer"
    >
      Track Shipment
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);
