export function LogoSvg({ className = 'w-11' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M50 90 C30 90 10 70 15 45 C20 20 40 10 50 10 C60 10 80 20 85 45 C90 70 70 90 50 90 Z" />
      <path d="M50 90 L50 10" />
      <path d="M50 90 C40 60 25 30 15 45" />
      <path d="M50 90 C60 60 75 30 85 45" />
      <path d="M50 90 C45 50 35 20 30 15" />
      <path d="M50 90 C55 50 65 20 70 15" />
    </svg>
  )
}
