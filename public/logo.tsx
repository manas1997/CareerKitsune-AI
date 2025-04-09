export function KitsuneLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill="#FF6B00" />
      <path d="M30 30C30 30 40 45 50 45C60 45 70 30 70 30" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M25 55C25 55 35 65 50 65C65 65 75 55 75 55" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 25L35 40M80 25L65 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <circle cx="40" cy="50" r="5" fill="white" />
      <circle cx="60" cy="50" r="5" fill="white" />
    </svg>
  )
}
