import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  Loader2,
  Info,
  X,
} from "lucide-react";
import { api_Config, UseApiUrl } from "../../../../services/api";
import { Toaster } from "../../../Toaster";
import { LoadingOverlay } from "../../../LoadingOverlay";

const ImportExcel = ({
  setOpenImportModal,
}: {
  setOpenImportModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Array<Record<string, unknown>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [datas, setDatas] = useState<Array<Record<string, unknown>>>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file || null);
    setSuccess(false);
    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
      setPreviewData(jsonData.slice(0, 5));
      jsonData.forEach((element) => {
        setDatas((prevData) => [
          ...prevData,
          {
            id: element.id,
            name: element.name,
            type: element.type,
            subcategory: element.subcategory,
            brand: element.brand,
            origin: element.origin,
            price: element.price,
            description: element.description,
            rating: element.rating,
            stock: element.stock,
            createdAt: element.createdAt,
            updatedAt: element.updatedAt,
            thumbnail: element.thumbnail,
            images: JSON.parse(String(element.images).replace(/'/g, '"')),
            material: element.material,
            variants: JSON.parse(String(element.variants).replace(/'/g, '"')),
            sold: element.sold,
            discountValue: element.discountValue,
            discountType: element.discountType,
            season: element.season,
          },
        ]);
      });
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      Toaster.error("Vui lòng chọn tệp Excel!");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(UseApiUrl(api_Config.Product.PostProduct), datas, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      Toaster.success("Import sản phẩm từ Excel thành công!");
      setTimeout(() => {
        setOpenImportModal(false);
      }, 2000);
    } catch (error) {
      console.error("Lỗi import:", error);
      Toaster.error("Import thất bại! Vui lòng kiểm tra lại file Excel.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="Đang import sản phẩm..." />
      <div className="relative bg-paper border-2 border-ink shadow-hard-lg w-full max-w-4xl mx-auto my-8 overflow-hidden">
        <div className="bg-ink text-paper px-6 py-4 flex items-center justify-between border-b-2 border-ink">
          <div>
            <span className="mono-label text-[10px] text-volt block">
              [BATCH MANIFEST // XLSX IMPORT]
            </span>
            <h2 className="font-display-safe text-xl font-black uppercase text-paper">
              Nhập sản phẩm từ Excel
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpenImportModal(false)}
            className="min-w-[44px] min-h-[44px] bg-paper text-ink border-2 border-ink flex items-center justify-center hover:bg-flash hover:text-paper transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 bg-bone max-h-[82vh] overflow-y-auto">
          <div className="p-4 bg-paper border-2 border-ink">
            <div className="flex items-center gap-2 mb-2 text-ink font-mono text-xs font-bold uppercase">
              <Info className="w-4 h-4 text-flash" />
              <span>Hướng dẫn nhập file Excel:</span>
            </div>
            <p className="font-sans text-xs text-ink leading-relaxed">
              File Excel cần có <b>tên cột trùng với thuộc tính của Product</b> như:
            </p>
            <pre className="bg-bone border border-ink p-3 font-mono text-[11px] text-ink overflow-x-auto mt-2">
              {`id | name | type | subcategory | brand | origin | price | description | rating | stock | createdAt | updatedAt | thumbnail | images | material | variants | sold | discountValue | discountType`}
            </pre>
            <p className="font-sans text-xs text-ink-muted mt-2">
              <b>Lưu ý:</b>
              - <code>images</code> có thể nhập nhiều URL, ngăn cách bởi dấu phẩy (,).
              - <code>variants</code> có thể để trống hoặc chứa JSON string.
              - <code>price</code>, <code>stock</code>, <code>sold</code>, <code>rating</code>, <code>discountValue</code> là số.
            </p>
          </div>

          <div
            className={`w-full p-8 border-2 border-dashed border-ink text-center transition-colors ${
              selectedFile || file ? "bg-volt/30" : "bg-paper hover:bg-volt/15"
            }`}
          >
            <label
              htmlFor="fileInput"
              className="cursor-pointer flex flex-col items-center gap-2 text-ink"
            >
              <FileSpreadsheet className="w-10 h-10 text-ink" />
              <span className="font-mono text-xs font-bold uppercase">
                {file
                  ? file.name
                  : selectedFile
                    ? selectedFile.name
                    : "Chọn tệp Excel (.xlsx, .xls)"}
              </span>
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {previewData.length > 0 && (
            <div className="bg-paper border-2 border-ink overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead className="bg-ink text-paper">
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        className="p-2.5 text-left font-bold uppercase border-r border-paper/20"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr
                      key={i}
                      className="even:bg-paper odd:bg-bone border-t border-ink"
                    >
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="p-2 text-ink truncate max-w-[150px]"
                        >
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="font-mono text-[10px] text-ink-muted uppercase text-center py-2 border-t border-ink">
                (Hiển thị trước 5 dòng đầu tiên)
              </p>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleFileUpload}
              className={`min-h-[48px] flex items-center gap-2 px-8 py-3 border-2 border-ink font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-hard-sm cursor-pointer ${
                isLoading
                  ? "bg-fog text-ink-muted cursor-not-allowed"
                  : "bg-flash text-paper hover:bg-ink"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Tải lên & Import
                </>
              )}
            </button>
          </div>

          {success && (
            <div className="flex justify-center items-center gap-2 mt-3 text-success font-mono text-xs font-bold uppercase">
              <CheckCircle className="w-4 h-4" />
              Import thành công!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImportExcel;
