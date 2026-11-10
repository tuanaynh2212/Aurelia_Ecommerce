import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { useContext, useState } from "react";
import { AdminContext } from "../../../contexts/AdminContext";
import { Bar, Doughnut, Radar, Line } from "react-chartjs-2";
import { TrendingUp, PieChart, Activity, DollarSign, ShoppingCart, Zap, Star } from "lucide-react";

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

export const Revenue = () => {
  const { revenueData, categoryData, ServiceData,dataRevenue } = useContext(AdminContext);
  const [hoveredCard, setHoveredCard] = useState(null);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

  const barData = {
    labels: revenueData.map((item) => item.thang),
    datasets: [
      {
        label: "Doanh thu",
        data: revenueData.map((item) => item.revenue),
        backgroundColor: (context:any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "black");
          gradient.addColorStop(1, "gray");
          return gradient;
        },
        borderRadius: 16,
        borderSkipped: false,
      },
      {
        label: "Đơn hàng",
        data: revenueData.map((item) => item.orders),
        backgroundColor: (context:any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
         gradient.addColorStop(0, "white");
          gradient.addColorStop(1, "gray");
          return gradient;
        },
        borderRadius: 16,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: categoryData.map((item) => item.type),
    datasets: [
      {
        data: categoryData.map((item) => item.value),
        backgroundColor: [
          "rgba(99, 102, 241, 0.95)",
          "rgba(236, 72, 153, 0.95)",
          "rgba(251, 146, 60, 0.95)",
          "rgba(34, 197, 94, 0.95)",
          "rgba(59, 130, 246, 0.95)",
          "rgba(249, 115, 22, 0.95)",
          "rgba(6, 182, 212, 0.95)",
        ],
        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 20,
        spacing: 4,
      },
    ],
  };

  const radarData = {
    labels: ServiceData.map((item) => item.service),
    datasets: [
      {
        label: "Số lượng sử dụng",
        data: ServiceData.map((item) => item.totalUse),
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: revenueData.map((item) => item.thang),
    datasets: [
      {
        label: "Xu hướng doanh thu",
        data: revenueData.map((item) => item.revenue),
        borderColor: "black",
        backgroundColor: (context:any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(0, 0, 0, 0.4)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
          return gradient;
        },
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "black",
        pointBorderWidth: 3,
        pointHoverBackgroundColor: "black",
        pointHoverBorderColor: "#ffffff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: { size: 13, weight: "600", family: "'Inter', sans-serif" },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: "#1f2937",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        padding: 16,
        borderRadius: 12,
        titleFont: { size: 14, weight: "700" },
        bodyFont: { size: 13 },
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 12, weight: "600" }
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.15)",
          drawBorder: false,
        },
        ticks: {
          color: "#64748b",
          font: { size: 12 }
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12, weight: "600" },
          usePointStyle: true,
          padding: 20,
          color: "#1f2937",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        padding: 16,
        borderRadius: 12,
      },
    },
    scales: {
      r: {
        angleLines: { color: "rgba(148, 163, 184, 0.2)" },
        grid: { color: "rgba(148, 163, 184, 0.2)" },
        pointLabels: {
          color: "#475569",
          font: { size: 11, weight: "600" },
        },
        ticks: {
          display: false,
          backdropColor: "transparent",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 13, weight: "600" },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: "#1f2937",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        padding: 16,
        borderRadius: 12,
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false },
    },
  };

  const stats = [
    {
      icon: DollarSign,
      title: "Tổng doanh thu",
      value: `${(totalRevenue ).toLocaleString("vi-VN")}đ`,
      change: `${dataRevenue?.growthRateRevenue >= 0 ? '+' : ''}${dataRevenue?.growthRateRevenue}%`,
      gradient: "bg-black/90",
      bgGradient: "bg-black/10",
    },
    {
      icon: ShoppingCart,
      title: "Tổng đơn hàng",
      value: totalOrders.toString(),
      change: revenueData.length >= 2
        ? `${dataRevenue?.growthRateOrders ? '+' : ''}${dataRevenue?.growthRateOrders}%`
        : "+0.0%",
      gradient: "bg-black/90",
      bgGradient: "bg-black/10",
    },
    {
      icon: TrendingUp,
      title: "Doanh thu TB",
      value: `${(avgRevenue ).toLocaleString("vi-VN")}đ`,
      change: "Trung bình",
      gradient: "bg-black/90",
      bgGradient: "bg-black/10",
    },
    {
      icon: Star,
      title: "Danh mục",
      value: categoryData.length.toString(),
      change: `${ServiceData.length} dịch vụ`,
      gradient: "bg-black/90",
      bgGradient: "bg-black/10",
    },
  ];

  return (
    <div className="max-h-screen overflow-y-scroll bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 md:p-8 p-3">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div>
                  <h1 className="md:text-5xl text-2xl text-black serif bg-clip-text ">
                    Quản lý Doanh thu
                  </h1>
                  <p className="text-slate-600 mt-1 text-lg">
                    Theo dõi và phân tích hiệu suất kinh doanh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative group cursor-pointer transition-all duration-500 ${
                hoveredCard === idx ? "scale-105" : ""
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgGradient} rounded-2xl blur-xl transition-opacity duration-500 ${
                hoveredCard === idx ? "opacity-100" : "opacity-0"
              }`}></div>
              <div className="relative bg-white/70 backdrop-blur-xl shadow-lg border border-white/60 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.gradient}  shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1   text-black  text-sm serif">
                    {stat.change}
                  </span>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl serif text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-black  shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Doanh thu & Đơn hàng</h3>
                <p className="text-sm text-slate-500">So sánh theo tháng</p>
              </div>
            </div>
            <div className="h-[340px]">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-black  shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Xu hướng tăng trưởng</h3>
                <p className="text-sm text-slate-500">Biểu đồ đường xu hướng</p>
              </div>
            </div>
            <div className="h-[340px]">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-black  shadow-md">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Phân bổ sản phẩm</h3>
                <p className="text-sm text-slate-500">Theo danh mục</p>
              </div>
            </div>
            <div className="h-[320px] flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-black  shadow-md">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Dịch vụ sử dụng</h3>
                <p className="text-sm text-slate-500">Phân bổ dịch vụ</p>
              </div>
            </div>
            <div className="h-[320px]">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};