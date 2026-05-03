// Skillorbit logo: a planet body with a tilted orbit ring
// and a small companion dot. Inherits text color via currentColor
// so it adapts to dark/light surfaces.

type Props = {
  size?: number;
  className?: string;
  withText?: boolean;
};

export default function Logo({ size = 28, className, withText = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span
        className="relative inline-flex items-center justify-center rounded-xl"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #D97757 0%, #E89274 100%)",
        }}
      >
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden
        >
          {/* Tilted orbit ring */}
          <ellipse
            cx="16"
            cy="16"
            rx="13"
            ry="5"
            stroke="white"
            strokeWidth="1.5"
            transform="rotate(-28 16 16)"
            opacity="0.85"
          />
          {/* Planet body */}
          <circle cx="16" cy="16" r="5" fill="white" />
          {/* Companion */}
          <circle cx="27" cy="9" r="1.5" fill="white" opacity="0.9" />
        </svg>
      </span>
      {withText && (
        <span className="font-semibold tracking-tight text-[15px] text-[#1F1E1D]">
          Skillorbit<span className="text-[#D97757]">.ai</span>
        </span>
      )}
    </span>
  );
}
