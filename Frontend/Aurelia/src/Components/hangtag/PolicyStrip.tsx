
export function PolicyStrip() {
  const items = [
    { label: "Giao hàng toàn quốc",  value: "2–3 ngày" },
    { label: "Miễn phí từ",           value: "500.000 ₫" },
    { label: "Đổi size",              value: "14 ngày" },
    { label: "Hoàn tiền",             value: "7 ngày" },
    { label: "Đo size AI",            value: "Miễn phí" },
    { label: "Hỗ trợ",               value: "8:00–22:00" },
  ];

  return (
    <section
      aria-label="Chính sách vận chuyển, đổi trả và hỗ trợ"
      className="w-full border-t border-b border-[var(--color-rule)]"
      style={{ background: "var(--color-paper)" }}
    >
      <div className="container-page">
        <div
          className="flex flex-wrap divide-x divide-[var(--color-rule)]"
          role="list"
        >
          {items.map((item) => (
            <div
              key={item.label}
              role="listitem"
              className="flex-1 min-w-[140px] px-4 py-4 flex flex-col gap-0.5"
            >
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-faint">
                {item.label}
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-ink">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
