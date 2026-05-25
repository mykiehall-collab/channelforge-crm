interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  variant?: "person" | "company" | "solid";
  className?: string;
}

const sizeClasses = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-16 h-16 text-xl",
};

const shapeClasses = {
  circle: "rounded-full",
  square: "rounded-lg",
};

const variantClasses = {
  person: "bg-[#2D7BFF]/20 text-[#2D7BFF]",
  company: "bg-[#1E3E73]/30 text-[#BBD7FF]",
  solid: "bg-[#2D7BFF] text-white",
};

export function Avatar({
  initials,
  size = "md",
  shape = "circle",
  variant = "person",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`flex items-center justify-center font-bold flex-shrink-0 ${
        sizeClasses[size]
      } ${shapeClasses[shape]} ${variantClasses[variant]} ${className}`}
    >
      {initials}
    </div>
  );
}
