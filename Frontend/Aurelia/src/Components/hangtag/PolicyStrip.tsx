import { Marquee } from "../UI/primitives/Marquee";

export function PolicyStrip() {
  return (
    <section aria-label="Chính sách vận chuyển và bảo hành">
      <Marquee
        tone="ink"
        items={[
          "ĐỔI TRẢ MIỄN PHÍ 14 NGÀY",
          "GIAO HÀNG TOÀN QUỐC",
          "TƯ VẤN SIZE BẰNG AI",
          "ĐẶT LỊCH THỬ ĐỒ TẠI BOUTIQUE",
        ]}
      />
    </section>
  );
}

export default PolicyStrip;
