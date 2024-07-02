function InProgress({ className, size = '40' }: { size?: string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#B9B7BE" />
      <rect x="26" y="18" width="4" height="4" rx="2" fill="white" />
      <rect x="18" y="18" width="4" height="4" rx="2" fill="white" />
      <rect x="10" y="18" width="4" height="4" rx="2" fill="white" />
    </svg>
  )
}

export default InProgress
