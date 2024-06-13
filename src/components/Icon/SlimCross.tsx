function SlimCross({
  className,
  onClick,
  size = 16,
  color = 'var(--white-900)',
}: {
  className?: string
  onClick?: () => void
  size?: number
  color?: string
}) {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7057 2.77673C15.0962 2.38621 15.0962 1.75304 14.7057 1.36252L14.6373 1.29414C14.2468 0.903619 13.6136 0.903619 13.2231 1.29414L7.99987 6.5174L2.77661 1.29414C2.38609 0.903618 1.75292 0.903619 1.3624 1.29414L1.29402 1.36252C0.903497 1.75304 0.903497 2.38621 1.29402 2.77673L6.51728 7.99999L1.29402 13.2232C0.903496 13.6138 0.903496 14.2469 1.29402 14.6375L1.3624 14.7058C1.75292 15.0964 2.38609 15.0964 2.77661 14.7058L7.99987 9.48258L13.2231 14.7058C13.6136 15.0964 14.2468 15.0964 14.6373 14.7058L14.7057 14.6375C15.0962 14.2469 15.0962 13.6138 14.7057 13.2232L9.48246 7.99999L14.7057 2.77673Z"
        fill={color}
      />
    </svg>
  )
}

export default SlimCross
