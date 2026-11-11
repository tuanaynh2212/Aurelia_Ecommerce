import React from "react";
import * as LucideIcons from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ name, className, size = 18 }) => {
  const iconsMap = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; size?: number }>
  >;
  const LucideIcon = iconsMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon className={className} size={size} />;
};

export default Icon;
