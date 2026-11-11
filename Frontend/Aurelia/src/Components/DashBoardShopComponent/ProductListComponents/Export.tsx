import * as XLSX from "xlsx";
import { Download } from "lucide-react";

interface ExportVariant {
  size?: string;
  color?: string;
}

interface ExportProductItem {
  productId?: string;
  name?: string;
  sold?: number;
  brand?: string;
  variants?: ExportVariant[];
}

export const Export = ({ Data }: { Data?: ExportProductItem[] }) => {
  if (!Data || Data.length === 0) {
    return (
      <div className="min-h-[48px] px-4 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] inline-flex items-center mono-label text-[var(--color-ink-muted)]">
        No data to export
      </div>
    );
  }
  const data = Data.map((item) => {
    const size = item?.variants?.map((variant) => variant.size) || [];
    const color = item?.variants?.map((variant) => variant.color) || [];
    return {
      "Id San Pham": item.productId,
      "Ten San Pham": item.name,
      "So Luong Ban": item.sold,
      Brand: item.brand,
      Size: size.join(", "),
      Color: color.join(", "),
    };
  });
  const exportData = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "ExportedData.xlsx");
  };
  return (
    <button
      onClick={exportData}
      className="min-h-[48px] px-5 py-2.5 bg-[var(--color-paper)] hover:bg-[var(--color-volt)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] transition-colors mono-label font-extrabold flex items-center gap-2 cursor-pointer"
    >
      <Download className="w-4 h-4" />
      Export
    </button>
  );
};
