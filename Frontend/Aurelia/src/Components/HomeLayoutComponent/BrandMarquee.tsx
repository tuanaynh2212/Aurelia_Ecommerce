import { Marquee } from "../UI/primitives/Marquee";

export const BrandMarquee = () => {
  const tourLineup = [
    "★ HEADLINER: AURELIA ATELIER",
    "PRISTINE STUDIO",
    "VALENTE MAISON",
    "ÉTOILE PARIS",
    "OPALINE LIVING",
    "SERAPHINE BLOOM",
    "MAISON MINIMAL",
    "MODERN TAILOR",
  ];

  const tourDates = [
    "WORLD TOUR '26 // LIVE SHOW",
    "STAGE 01: TP. HỒ CHÍ MINH",
    "STAGE 02: HÀ NỘI",
    "STAGE 03: ĐÀ NẴNG",
    "DOORS OPEN: 24/7 ONLINE",
    "SOUNDCHECK AI BODY SCAN",
    "OFFICIAL MERCH BOOTH",
  ];

  return (
    <section
      aria-label="Tour Lineup và Lịch trình Concert"
      className="w-full select-none overflow-hidden"
    >
      <Marquee tone="ink" separator="★" items={tourLineup} />
      <Marquee tone="volt" reverse separator="//" items={tourDates} />
    </section>
  );
};

export default BrandMarquee;
