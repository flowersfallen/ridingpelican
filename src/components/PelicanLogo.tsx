interface PelicanLogoProps {
  className?: string;
}

export function PelicanLogo({ className = 'w-10 h-10' }: PelicanLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="Riding Pelican Logo"
    >
      <rect width="64" height="64" rx="16" fill="#FAF8F4" stroke="#E4E0D6" strokeWidth="2" />
      <circle cx="19" cy="44" r="10" stroke="#18181B" strokeWidth="3" />
      <circle cx="45" cy="44" r="10" stroke="#18181B" strokeWidth="3" />
      <circle cx="19" cy="44" r="2.2" fill="#E14D2A" />
      <circle cx="45" cy="44" r="2.2" fill="#E14D2A" />
      <path d="M19 44 L31 44 L39 30 L26 30 Z" stroke="#E14D2A" strokeWidth="3" strokeLinejoin="round" />
      <path
        d="M26 30 L24 25 M39 30 L45 44 M39 30 L38 23 L43 22"
        stroke="#E14D2A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="26" cy="24" rx="9" ry="7" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.2" />
      <path d="M28 24 Q35 23 39 23" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M27 30 L31 43" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M31 20 Q34 13 33 10" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="33" cy="11" r="4" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
      <circle cx="34.5" cy="10.2" r="1" fill="#18181B" />
      <path d="M36 10 L52 13 L36 14 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M36 13 Q44 21 50 13" fill="#FBBF24" stroke="#18181B" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
