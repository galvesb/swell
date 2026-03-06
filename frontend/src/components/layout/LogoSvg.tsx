const SHELL_COLOR = '#348b92'

export function LogoSvg({ className = 'w-44' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="30 10 180 80"
      className={className}
    >
      <text
        x="40"
        y="70"
        style={{ fontFamily: "'Pacifico', cursive", fontSize: 48, fill: SHELL_COLOR }}
      >
        Swell
      </text>

      <g transform="translate(165, 35) scale(0.6)">
        {[
          'M20,40 C5,40 -5,25 2,10 C8,-5 25,-5 48,10 C55,25 45,40 30,40 L20,40 Z',
          'M25,0 L25,40',
          'M12,4 L20,40',
          'M38,4 L30,40',
          'M4,15 L15,40',
          'M46,15 L35,40',
          'M15,40 L12,46 C12,48 14,50 17,50 L33,50 C36,50 38,48 38,46 L35,40 Z',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              fill: 'none',
              stroke: SHELL_COLOR,
              strokeWidth: 2,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            }}
          />
        ))}
      </g>
    </svg>
  )
}
