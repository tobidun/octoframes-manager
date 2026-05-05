import { STATUS_COLORS } from "@/lib/constants";

interface BadgeProps {
  text: string;
  color?: string;
  className?: string;
}

export function Badge({ text, color, className }: BadgeProps) {
  const bgColor = color || STATUS_COLORS[text] || "#71717a";
  
  return (
    <span 
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${className}`}
      style={{ 
        backgroundColor: `${bgColor}22`, 
        color: bgColor, 
        borderColor: `${bgColor}44` 
      }}
    >
      {text}
    </span>
  );
}
