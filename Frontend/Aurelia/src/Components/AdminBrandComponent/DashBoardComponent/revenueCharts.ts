import type { ChartOptions } from "chart.js";
import type {
  CategoryStockPoint,
  MonthlyRevenuePoint,
  ServiceUsagePoint,
} from "../../../contexts/AdminContext";
import {
  CHART,
  MONO_FONT,
  SERIES,
  chartJsAxis,
  chartJsLegend,
  chartJsTooltip,
} from "../../UI/tokens/chartPalette";

export function buildRevenueBarData(revenueData: MonthlyRevenuePoint[]) {
  return {
    labels: revenueData.map((item) => item.thang),
    datasets: [
      {
        label: "Doanh thu",
        data: revenueData.map((item) => item.revenue),
        backgroundColor: CHART.ink,
        borderColor: CHART.ink,
        borderWidth: 2,
      },
      {
        label: "Đơn hàng",
        data: revenueData.map((item) => item.orders),
        backgroundColor: CHART.flash,
        borderColor: CHART.ink,
        borderWidth: 2,
      },
    ],
  };
}

export function buildCategoryDoughnutData(categoryData: CategoryStockPoint[]) {
  return {
    labels: categoryData.map((item) => item.type),
    datasets: [
      {
        data: categoryData.map((item) => item.value),
        backgroundColor: [...SERIES],
        borderColor: CHART.ink,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };
}

export function buildServiceRadarData(serviceData: ServiceUsagePoint[]) {
  return {
    labels: serviceData.map((item) => item.service),
    datasets: [
      {
        label: "Số lượng sử dụng",
        data: serviceData.map((item) => item.totalUse),
        backgroundColor: CHART.flashSoft,
        borderColor: CHART.flash,
        borderWidth: 2,
        pointBackgroundColor: CHART.ink,
        pointBorderColor: CHART.paper,
        pointHoverBackgroundColor: CHART.volt,
        pointHoverBorderColor: CHART.ink,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };
}

export function buildRevenueLineData(revenueData: MonthlyRevenuePoint[]) {
  return {
    labels: revenueData.map((item) => item.thang),
    datasets: [
      {
        label: "Xu hướng doanh thu",
        data: revenueData.map((item) => item.revenue),
        borderColor: CHART.ink,
        backgroundColor: CHART.voltSoft,
        borderWidth: 3,
        fill: true,
        tension: 0.25,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: CHART.volt,
        pointBorderColor: CHART.ink,
        pointBorderWidth: 2,
      },
    ],
  };
}

export const BAR_CHART_OPTIONS: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: "top", ...chartJsLegend },
    tooltip: chartJsTooltip,
  },
  scales: {
    x: { ...chartJsAxis, grid: { display: false } },
    y: { ...chartJsAxis },
  },
};

export const RADAR_CHART_OPTIONS: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top", ...chartJsLegend },
    tooltip: chartJsTooltip,
  },
  scales: {
    r: {
      angleLines: { color: CHART.grid },
      grid: { color: CHART.grid },
      pointLabels: {
        color: CHART.ink,
        font: { size: 11, family: MONO_FONT, weight: 700 },
      },
      ticks: { display: false, backdropColor: CHART.transparent },
    },
  },
};

export const DOUGHNUT_CHART_OPTIONS: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "65%",
  plugins: {
    legend: { position: "right", ...chartJsLegend },
    tooltip: chartJsTooltip,
  },
};

export const LINE_CHART_OPTIONS: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: chartJsTooltip,
  },
  scales: {
    x: { ...chartJsAxis, grid: { display: false } },
    y: { ...chartJsAxis },
  },
};

