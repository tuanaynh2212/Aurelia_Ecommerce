import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useContext, useState } from "react";
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2";
import {
  Activity,
  DollarSign,
  PieChart,
  ShoppingCart,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AdminContext } from "../../../contexts/AdminContext";
import { SplitFlap } from "../../UI/primitives/SplitFlap";
import {
  BAR_CHART_OPTIONS,
  DOUGHNUT_CHART_OPTIONS,
  LINE_CHART_OPTIONS,
  RADAR_CHART_OPTIONS,
  buildCategoryDoughnutData,
  buildRevenueBarData,
  buildRevenueLineData,
  buildServiceRadarData,
} from "./revenueCharts";

ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const formatCompactVND = (amount: number) =>
  `${Math.round(amount).toLocaleString("vi-VN")}đ`;

export const Revenue = () => {
  const { revenueData, categoryData, ServiceData, dataRevenue } =
    useContext(AdminContext);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgRevenue =
    revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

  const stats = [
    {
      icon: DollarSign,
      title: "Tổng doanh thu",
      value: formatCompactVND(totalRevenue),
      change: `${(dataRevenue?.growthRateRevenue ?? -1) >= 0 ? "+" : ""}${dataRevenue?.growthRateRevenue}%`,
    },
    {
      icon: ShoppingCart,
      title: "Tổng đơn hàng",
      value: totalOrders.toString(),
      change:
        revenueData.length >= 2
          ? `${dataRevenue?.growthRateOrders ? "+" : ""}${dataRevenue?.growthRateOrders}%`
          : "+0.0%",
    },
    {
      icon: TrendingUp,
      title: "Doanh thu TB",
      value: formatCompactVND(avgRevenue),
      change: "Trung bình",
    },
    {
      icon: Star,
      title: "Danh mục",
      value: categoryData.length.toString(),
      change: `${ServiceData.length} dịch vụ`,
    },
  ];

  return (
    <div className="min-h-screen overflow-y-auto bg-bone p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="bg-paper border-2 border-ink shadow-hard p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="mono-label text-[10px] text-flash block mb-1">
              [CONTROL ROOM // FINANCIAL LEDGER]
            </span>
            <h1 className="font-display-safe text-3xl md:text-4xl font-black uppercase text-ink">
              Quản lý Doanh thu
            </h1>
            <p className="font-mono text-xs text-ink-muted mt-1">
              Theo dõi và phân tích hiệu suất kinh doanh
            </p>
          </div>
          <span className="hud-chip bg-ink text-paper self-start md:self-auto">
            SIDE A // TELEMETRY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-paper border-2 border-ink p-5 transition-transform cursor-pointer ${
                hoveredCard === idx
                  ? "-translate-y-1 shadow-hard-lg"
                  : "shadow-hard"
              }`}
            >
              <div className="flex items-start justify-between mb-4 pb-3 border-b-2 border-ink">
                <div className="w-10 h-10 bg-ink text-paper flex items-center justify-center">
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 bg-volt border border-ink text-ink font-mono text-[10px] font-bold uppercase">
                  {stat.change}
                </span>
              </div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-2">
                {stat.title}
              </p>
              <div className="overflow-x-auto">
                <SplitFlap value={stat.value} size="sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-paper border-2 border-ink shadow-hard p-6">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-ink">
              <div className="w-10 h-10 bg-ink text-paper flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display-safe text-lg font-black uppercase text-ink">
                  Doanh thu & Đơn hàng
                </h3>
                <p className="font-mono text-xs text-ink-muted">
                  So sánh theo tháng
                </p>
              </div>
            </div>
            <div className="h-[340px]">
              <Bar
                data={buildRevenueBarData(revenueData)}
                options={BAR_CHART_OPTIONS}
              />
            </div>
          </div>

          <div className="bg-paper border-2 border-ink shadow-hard p-6">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-ink">
              <div className="w-10 h-10 bg-flash text-paper flex items-center justify-center border-2 border-ink">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display-safe text-lg font-black uppercase text-ink">
                  Xu hướng tăng trưởng
                </h3>
                <p className="font-mono text-xs text-ink-muted">
                  Biểu đồ đường xu hướng
                </p>
              </div>
            </div>
            <div className="h-[340px]">
              <Line
                data={buildRevenueLineData(revenueData)}
                options={LINE_CHART_OPTIONS}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-paper border-2 border-ink shadow-hard p-6">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-ink">
              <div className="w-10 h-10 bg-ink text-paper flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display-safe text-lg font-black uppercase text-ink">
                  Phân bổ sản phẩm
                </h3>
                <p className="font-mono text-xs text-ink-muted">
                  Theo danh mục
                </p>
              </div>
            </div>
            <div className="h-[320px] flex items-center justify-center">
              <Doughnut
                data={buildCategoryDoughnutData(categoryData)}
                options={DOUGHNUT_CHART_OPTIONS}
              />
            </div>
          </div>

          <div className="bg-paper border-2 border-ink shadow-hard p-6">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-ink">
              <div className="w-10 h-10 bg-volt text-ink border-2 border-ink flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display-safe text-lg font-black uppercase text-ink">
                  Dịch vụ sử dụng
                </h3>
                <p className="font-mono text-xs text-ink-muted">
                  Phân bổ dịch vụ
                </p>
              </div>
            </div>
            <div className="h-[320px]">
              <Radar
                data={buildServiceRadarData(ServiceData)}
                options={RADAR_CHART_OPTIONS}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
