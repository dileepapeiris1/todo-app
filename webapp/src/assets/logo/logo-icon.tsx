const LogoIcon = ({ size = 28 }: { size?: number }) => (
  <svg style={{ width: size, height: size }} viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="7" fill="#2563eb" />
    <path d="M7 14l4.5 4.5 9.5-9" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default LogoIcon;
