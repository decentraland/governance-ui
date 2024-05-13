function DotsMenu({ onClick, color = 'var(--black-600)' }: { onClick?: () => void; color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" fill="none" viewBox="0 0 25 24" onClick={onClick}>
      <circle cx="12.055" cy="7" r="1.5" fill={color}></circle>
      <circle cx="12.055" cy="12" r="1.5" fill={color}></circle>
      <circle cx="12.055" cy="17" r="1.5" fill={color}></circle>
    </svg>
  )
}

export default DotsMenu
