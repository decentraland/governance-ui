export default function Eth({ size = 45 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      id="eth"
      x={0}
      y={0}
      enableBackground="new 0 0 500 500"
      width={size}
      height={size}
      viewBox="0 0 500 500"
    >
      <path fill="#2F3030" d="M249.982 6.554 397.98 251.112l-147.45-63.02z" />
      <path fill="#828384" d="M102.39 251.112 249.982 6.554l.548 181.538z" />
      <path fill="#343535" d="M249.982 341.285 102.39 251.112l148.14-63.02z" />
      <path fill="#131313" d="m397.98 251.112-147.45-63.02-.548 153.193z" />
      <path fill="#2F3030" d="m249.982 372.329 147.998-87.732L249.982 493.13z" />
      <path fill="#828384" d="M249.982 372.329 102.39 284.597 249.982 493.13z" />
    </svg>
  )
}
