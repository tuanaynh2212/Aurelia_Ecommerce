export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Collections", path: "/Collection" },
  { label: "Products", path: "/Fashion/Products" },
  { label: "Soundcheck AI", path: "/bodyMeasurements" },
  { label: "About", path: "/about" },
] as const;

export function isNavLinkActive(pathname: string, linkPath: string): boolean {
  return (
    pathname === linkPath ||
    (linkPath !== "/" && pathname.startsWith(linkPath))
  );
}

