function LateClock({ className, size = '12' }: { size?: string; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="6" fill="white" />
      <g clipPath="url(#clip0_16349_2225)">
        <path
          d="M6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 7.5913 11.3679 9.11742 10.2426 10.2426C9.11742 11.3679 7.5913 12 6 12C4.4087 12 2.88258 11.3679 1.75736 10.2426C0.632141 9.11742 0 7.5913 0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0ZM5.4375 2.8125V6C5.4375 6.1875 5.53125 6.36328 5.68828 6.46875L7.93828 7.96875C8.19609 8.14219 8.54531 8.07187 8.71875 7.81172C8.89219 7.55156 8.82187 7.20469 8.56172 7.03125L6.5625 5.7V2.8125C6.5625 2.50078 6.31172 2.25 6 2.25C5.68828 2.25 5.4375 2.50078 5.4375 2.8125Z"
          fill="#736E7D"
        />
      </g>
      <defs>
        <clipPath id="clip0_16349_2225">
          <rect width={size} height={size} fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default LateClock
