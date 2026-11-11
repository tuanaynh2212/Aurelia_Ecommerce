import { CheckCircle2, XCircle } from "lucide-react";
import { Ticket } from "./UI";

export const NotifySuccessBooking = ({
  data,
  status,
}: {
  data: string | undefined;
  status: string;
}) => {
  const isSuccess = status === "Thêm Lịch Hẹn Thành Công!";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-bone)] p-4">
      <div className="max-w-lg w-full">
        <Ticket
          serial={isSuccess ? "BOOKING-OK" : "BOOKING-ERR"}
          header={isSuccess ? "ADMISSION CONFIRMED" : "BOOKING FAILED"}
          stampText={isSuccess ? "CONFIRMED" : "ERROR"}
          stub={
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className={`w-full min-h-[48px] px-6 py-3 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] mono-label font-extrabold transition-all cursor-pointer ${
                isSuccess
                  ? "bg-[var(--color-flash)] text-[var(--color-paper)]"
                  : "bg-[var(--color-danger)] text-[var(--color-paper)]"
              }`}
            >
              {isSuccess ? "Quay lại Trang Chủ" : "Thử lại"}
            </button>
          }
        >
          <div className="text-center space-y-4 py-2">
            {isSuccess ? (
              <CheckCircle2 className="w-16 h-16 text-[var(--color-success)] mx-auto" />
            ) : (
              <XCircle className="w-16 h-16 text-[var(--color-danger)] mx-auto" />
            )}

            <h1
              className={`display-m font-display-safe ${
                isSuccess
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-danger)]"
              }`}
            >
              {status}
            </h1>

            {isSuccess ? (
              <p className="text-xs font-mono text-[var(--color-ink-muted)] leading-relaxed">
                Cảm ơn bạn đã đặt lịch tại{" "}
                <span className="font-extrabold text-[var(--color-ink)]">
                  {data}
                </span>
                .
                <br />
                Chúng tôi sẽ liên hệ xác nhận trong vòng{" "}
                <span className="bg-[var(--color-volt)] text-[var(--color-ink)] px-1 font-extrabold">
                  30 phút
                </span>
                .
              </p>
            ) : (
              <p className="text-xs font-mono text-[var(--color-ink-muted)] leading-relaxed">
                Rất tiếc, hệ thống không thể tạo lịch hẹn của bạn tại{" "}
                <span className="font-extrabold text-[var(--color-ink)]">
                  {data}
                </span>
                .
                <br />
                Vui lòng thử lại sau hoặc liên hệ trực tiếp qua{" "}
                <span className="text-[var(--color-flash)] font-extrabold">
                  hotline
                </span>{" "}
                để được hỗ trợ.
              </p>
            )}
          </div>
        </Ticket>
      </div>
    </div>
  );
};
