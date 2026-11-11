import { motion, type Variants } from "framer-motion";
import {
  BarChart3,
  DollarSign,
  Percent,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { AdminContext } from "../../../contexts/AdminContext";
import { formatVND } from "../../../utils/formatters";
import {
  CHART,
  chartJsAxis,
  chartJsTooltip,
} from "../../UI/tokens/chartPalette";
import BestSeller from "./BestSeller";
import StatsCard from "./StatsCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const OVERVIEW_BAR_OPTIONS: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: chartJsTooltip,
  },
  scales: {
    y: { beginAtZero: true, ...chartJsAxis },
    x: { ...chartJsAxis, grid: { display: false } },
  },
};

function formatTrend(rate: number | undefined, negativeValue?: number) {
  const positive = typeof rate === "number" && rate >= 0;
  return {
    trend: positive ? `+${rate}%` : `${negativeValue ?? rate}%`,
    isPositive: positive,
  };
}

export const OverView = () => {
  const { dataRevenue, dataUser, doanhThuCuaHang, bestSellingProducts } =
    useContext(AdminContext);

  const data: ChartData<"bar"> = {
    labels: doanhThuCuaHang.map((item) => item.shopName),
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: doanhThuCuaHang.map((item) => item.revenue),
        backgroundColor: [CHART.ink, CHART.flash, CHART.volt, CHART.info],
        borderColor: CHART.ink,
        borderWidth: 2,
        hoverBackgroundColor: CHART.volt,
      },
    ],
  };

  const cards = [
    {
      icon: <DollarSign className="text-paper" size={20} />,
      title: "Doanh thu",
      value: formatVND(dataRevenue?.totalRevenue),
      ...formatTrend(dataRevenue?.growthRateRevenue),
    },
    {
      icon: <ShoppingBag className="text-paper" size={20} />,
      title: "Đơn hàng",
      value: dataRevenue?.totalOrders.toLocaleString("vi-VN"),
      ...formatTrend(dataRevenue?.growthRateOrders),
    },
    {
      icon: <Users className="text-paper" size={20} />,
      title: "Khách hàng",
      value: dataUser?.soLuongKhachDangKy.toLocaleString("vi-VN"),
      ...formatTrend(dataUser?.tyLeKhachHang, dataUser?.tyLeKhachHangMoi),
    },
    {
      icon: <Percent className="text-paper" size={20} />,
      title: "Mã giảm giá",
      value: dataUser?.soLuongCoupon.toLocaleString("vi-VN"),
      ...formatTrend(dataUser?.tyLeCoupon),
    },
  ];

  return (
    <motion.div
      className="min-h-screen p-4 md:p-8 bg-bone overflow-y-auto"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      <motion.div
        className="mb-8 bg-paper border-2 border-ink shadow-hard p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        variants={FADE_UP}
      >
        <div>
          <span className="mono-label text-[10px] text-flash block mb-1">
            [CONTROL ROOM // BRAND TELEMETRY]
          </span>
          <h2 className="font-display-safe text-3xl lg:text-4xl font-black uppercase tracking-tight text-ink">
            Bảng tổng quan thương hiệu
          </h2>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Cập nhật hiệu suất và tình hình kinh doanh mới nhất
          </p>
        </div>
        <span className="hud-chip bg-volt text-ink self-start sm:self-auto">
          OPTICAL RIG // CALIBRATED
        </span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <StatsCard key={idx} data={card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={FADE_UP}
          className="lg:col-span-2 bg-paper border-2 border-ink shadow-hard p-6"
        >
          <div className="flex flex-wrap justify-between items-center gap-4 pb-4 mb-6 border-b-2 border-ink">
            <div>
              <span className="mono-label text-[10px] text-ink-muted block">
                [STORE REVENUE MATRIX]
              </span>
              <h2 className="font-display-safe text-xl font-black uppercase text-ink">
                Doanh thu theo cửa hàng
              </h2>
              <p className="font-mono text-xs text-ink-muted mt-0.5">
                Hiệu suất doanh thu tháng này
              </p>
            </div>
            <button
              type="button"
              className="min-h-[44px] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider bg-bone border-2 border-ink text-ink hover:bg-volt transition-colors cursor-pointer"
            >
              Xem chi tiết →
            </button>
          </div>

          {doanhThuCuaHang.length > 0 ? (
            <div className="h-80">
              <Bar data={data} options={OVERVIEW_BAR_OPTIONS} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-ink-muted bg-bone border-2 border-dashed border-ink">
              <BarChart3 className="w-12 h-12 mb-3 text-ink" />
              <span className="font-mono text-xs font-bold uppercase text-ink">
                Biểu đồ đang được cập nhật...
              </span>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col">
          <BestSeller TOP_PRODUCTS={bestSellingProducts.slice(0, 5)} />

          <button
            type="button"
            className="w-full min-h-[44px] mt-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider bg-paper text-ink hover:bg-ink hover:text-paper transition-colors border-2 border-ink shadow-hard-sm cursor-pointer"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </motion.div>
  );
};
