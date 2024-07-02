function CrossCircle({ className, size = '40' }: { size?: string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#D80027" />
      <path d="M14 14L26 26M26 14L14 26" stroke="white" strokeWidth="4" />
    </svg>
  )
}

export default CrossCircle
