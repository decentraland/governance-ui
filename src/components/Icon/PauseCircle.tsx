function PauseCircle({ className, size = '40' }: { size?: string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#FFB03F" />
      <path d="M16 12V28" stroke="white" strokeWidth="3" />
      <path d="M24 12V28" stroke="white" strokeWidth="3" />
    </svg>
  )
}

export default PauseCircle
