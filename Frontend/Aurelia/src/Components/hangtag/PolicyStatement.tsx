
export function PolicyStatement() {
  return (
    <section
      aria-labelledby="policy-statement"
      className="w-full"
      style={{ background: "var(--color-kraft)" }}
    >
      <div className="container-page py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <p
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted mb-6"
            aria-hidden="true"
          >
            — Cam kết từ Aurellia
          </p>

          <blockquote
            id="policy-statement"
            className="font-heading text-[1.75rem] md:text-[2.5rem] lg:text-[3rem] leading-[1.2] font-medium text-ink"
            style={{ fontVariationSettings: "'opsz' 72" }}
          >
            "Nếu size không vừa, chúng tôi đổi miễn phí. Không cần giải thích.
            Không cần hóa đơn. Trong vòng 14 ngày kể từ ngày nhận hàng."
          </blockquote>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-[rgba(42,33,27,0.2)]">
            {[
              {
                label: "Đổi size",
                value: "14 ngày",
                note: "Miễn phí, tận nơi",
              },
              {
                label: "Hoàn tiền",
                value: "7 ngày",
                note: "Chuyển khoản hoặc tiền mặt",
              },
              {
                label: "Miễn phí giao",
                value: "500.000 ₫",
                note: "Toàn quốc, đơn từ 500k",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="pt-6 pb-2 pr-8"
                style={{
                  borderLeft: i > 0 ? "1px solid rgba(42,33,27,0.15)" : "none",
                  paddingLeft: i > 0 ? "2rem" : "0",
                }}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-1">
                  {item.label}
                </p>
                <p className="font-mono text-2xl font-semibold tabular-nums text-ink leading-none mb-1">
                  {item.value}
                </p>
                <p className="font-body text-xs text-ink-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
