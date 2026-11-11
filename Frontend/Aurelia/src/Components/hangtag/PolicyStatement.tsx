import { ShieldCheck, FileText, RefreshCw } from "lucide-react";

export function PolicyStatement() {
  const pillars = [
    {
      code: "RIDER 01",
      icon: FileText,
      title: "Thông số in trực tiếp trên mác",
      body: "Thành phần sợi vải, định lượng GSM, xuất xứ và hướng dẫn bảo quản được niêm yết công khai như backstage pass.",
    },
    {
      code: "RIDER 02",
      icon: ShieldCheck,
      title: "Giá niêm yết minh bạch",
      body: "Không nâng giá ảo trước khuyến mãi. Mọi ưu đãi voucher và vé thành viên được tính rõ trên hóa đơn.",
    },
    {
      code: "RIDER 03",
      icon: RefreshCw,
      title: "Đổi trả miễn phí 14 ngày",
      body: "Hỗ trợ đổi size tận nơi hoặc tại các trạm cửa hàng Aurelia trên toàn quốc.",
    },
  ];

  return (
    <section
      aria-label="Tour Rider & Cam kết minh bạch"
      className="border-b-[3px] border-ink bg-volt py-12 md:py-16 text-ink"
    >
      <div className="container-atelier">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
          <span className="border-2 border-ink bg-ink px-2.5 py-0.5 mono-label text-[11px] font-extrabold text-volt">
            [BACKSTAGE RIDER // QUY CHUẨN TOUR DIỄN]
          </span>
          <span className="mono-label text-[11px] font-extrabold text-ink">
            03 CAM KẾT ĐẢM BẢO CHÍNH THỨC
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {pillars.map((item) => (
            <div
              key={item.code}
              className="border-2 border-ink bg-paper p-6 shadow-hard-lg rounded-[2px]"
            >
              <div className="flex items-center justify-between border-b-2 border-dashed border-ink pb-3">
                <span className="border-2 border-ink bg-ink px-2.5 py-0.5 mono-label text-xs font-extrabold text-volt">
                  [{item.code}]
                </span>
                <item.icon size={20} strokeWidth={2.5} className="text-ink" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-extrabold uppercase text-ink diacritic-safe">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PolicyStatement;
