import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Compass, KeyRound, ArrowUpRight } from "lucide-react";
import { Barcode } from "./UI/primitives/Barcode";
import { DottedLeaderRow } from "./UI/primitives/DottedLeaderRow";
import { SceneShell } from "./UI/three/SceneShell";
import { FloatingPass } from "./UI/three/FloatingPass";
import { FloatingTicket } from "./UI/three/FloatingTicket";

export const EditorialPanel = ({ role }: { role: "MANAGER" | "USER" }) => {
  const isManager = role === "MANAGER";
  const imageUrl = isManager
    ? "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2070&auto=format&fit=crop";

  const features = isManager
    ? [
        {
          icon: ShieldCheck,
          code: "SYS-01",
          label: "Đồng bộ tồn kho & đơn hàng thời gian thực",
        },
        {
          icon: Compass,
          code: "SYS-02",
          label: "Điều phối lịch hẹn Bespoke & đo mẫu tại xưởng",
        },
        {
          icon: KeyRound,
          code: "SYS-03",
          label: "Phân quyền bảo mật hai lớp Cửa Hàng & Quản Trị",
        },
      ]
    : [
        {
          icon: Sparkles,
          code: "VIP-01",
          label: "Lưu trữ hồ sơ số đo AI Soundcheck chuẩn xác",
        },
        {
          icon: Compass,
          code: "VIP-02",
          label: "Đặt lịch hẹn thử đồ riêng tư & theo dõi đơn trực tiếp",
        },
        {
          icon: ShieldCheck,
          code: "VIP-03",
          label: "Tích lũy hạng thẻ thành viên & vé ưu đãi độc quyền",
        },
      ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-ink border-r-2 border-ink flex flex-col justify-between p-8 xl:p-12 select-none">
      {/* Background Atelier Photography */}
      <div
        className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-35"
        style={{
          backgroundImage: `url('${imageUrl}')`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 studio-grid-bg opacity-15 pointer-events-none"
        aria-hidden="true"
      />

      {/* Interactive 3D Lanyard Pass & Floating Ticket Stage */}
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-85">
        <SceneShell
          station="TICKET_BOOTH"
          cameraPosition={[0, 0.2, 5.2]}
          fallbackTitle="AURELIA // ACCESS"
          className="h-full w-full"
        >
          <FloatingPass
            tier={isManager ? "royal" : "diamond"}
            position={[1.35, 0.35, 0.4]}
            rotation={[0.08, -0.38, 0.05]}
            scale={0.78}
          />
          <FloatingTicket
            position={[-1.55, -0.55, 0.2]}
            rotation={[0.14, 0.32, -0.1]}
            scale={0.75}
            tone="volt"
          />
        </SceneShell>
      </div>

      {/* Top Brutalist Telemetry Header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="bg-paper border-2 border-ink shadow-hard px-4 py-2.5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="h-2 w-2 rounded-full bg-flash animate-rec" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-flash">
              {isManager
                ? "[CONTROL ROOM // STAFF GATE]"
                : "[ATELIER-01 // CLIENT GATE]"}
            </span>
          </div>
          <span className="font-display-safe text-base xl:text-lg font-black uppercase text-ink block">
            {isManager ? "HỆ THỐNG VẬN HÀNH AURELIA" : "KHÔNG GIAN HỘI VIÊN AURELIA"}
          </span>
        </div>

        <span className="hud-chip bg-volt text-ink">
          OPTICAL RIG // CALIBRATED
        </span>
      </div>

      {/* Middle Monolithic Editorial Headline & Feature Badges */}
      <div className="relative z-10 my-auto py-8 max-w-xl space-y-6">
        <div className="inline-flex items-center gap-2 bg-flash text-paper border-2 border-ink px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest shadow-hard-sm">
          <span>ADMIT ONE</span>
          <span>//</span>
          <span>{isManager ? "INTERNAL CLEARANCE" : "SEASON ARCHIVE 2025"}</span>
        </div>

        <div className="bg-paper/95 border-2 border-ink p-6 shadow-hard-lg space-y-3">
          <h2 className="font-display-safe text-3xl xl:text-4xl font-black uppercase tracking-tight text-ink leading-[1.12]">
            {isManager
              ? "Điều Phối Cửa Hàng & Quản Trị Thương Hiệu"
              : " Xưởng May Đo Số & Đặc Quyền Hội Viên"}
          </h2>
          <p className="font-sans text-xs xl:text-sm text-ink-muted leading-relaxed">
            {isManager
              ? "Truy cập bảng điều khiển trung tâm để quản lý danh mục sản phẩm, theo dõi hiệu suất doanh thu và xử lý đơn hàng trên toàn hệ thống."
              : "Đăng nhập để đồng bộ giỏ hàng, lưu số đo cơ thể từ buồng quét AI Soundcheck và nhận vé ưu đãi cho từng bộ sưu tập."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="flex items-center gap-3 bg-paper/95 border-2 border-ink px-3.5 py-2.5 shadow-hard-sm"
              >
                <div className="w-8 h-8 bg-ink text-volt border border-ink flex items-center justify-center shrink-0">
                  <Icon size={15} />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 bg-bone border border-ink text-ink shrink-0">
                  {item.code}
                </span>
                <span className="font-sans text-xs font-semibold text-ink">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Brutalist Dossier Footer */}
      <div className="relative z-10 bg-paper border-2 border-ink shadow-hard-lg p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <DottedLeaderRow
            label="TRẠM TRUY CẬP"
            value={isManager ? "CONTROL_ROOM" : "TICKET_BOOTH"}
          />
          <DottedLeaderRow
            label="PHÂN QUYỀN"
            value={isManager ? "MANAGER / ADMIN" : "PRIVATE CLIENT"}
          />
        </div>

        <div className="flex items-center justify-between xl:justify-end gap-4 pt-3 xl:pt-0 border-t-2 xl:border-t-0 xl:border-l-2 border-dashed border-ink xl:pl-4">
          <Barcode value={`AURELIA-${role}`} height={24} />
          <Link
            to={isManager ? "/account" : "/login"}
            className="min-h-[40px] px-3 py-2 bg-bone border-2 border-ink font-mono text-[10px] font-bold uppercase text-ink hover:bg-volt transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <span>{isManager ? "Cổng Khách Hàng" : "Cổng Quản Trị"}</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
