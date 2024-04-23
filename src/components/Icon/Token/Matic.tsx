export default function Matic({ size = 45 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      id="matic"
      x={0}
      y={0}
      enableBackground="new 0 0 500 500"
      width={size}
      height={size}
      viewBox="0 0 500 500"
    >
      <style>{'.st1{fill:#2b6def}.st2{fill:#2891f9}'}</style>
      <path
        d="M331.9 195.9v-95.3l83.3-46.1 80.3 46.9V396l-79.6 46.1-83.3-46.9V290.3L250.8 338l-83.3-48.4v105.6l-81.1 46.9-82.6-47.6V102.1l82.6-46.8z"
        style={{
          fill: '#2bbdf7',
        }}
      />
      <path d="m495.5 101.4-80.7 47-82.9-47.8 83.3-46.1z" className="st1" />
      <path d="M415.9 442.1V148.4l-84-47.8.7 294.6z" className="st2" />
      <path d="m86.4 55.3 245.5 140.6-81.2 47.6L3.8 102.1z" className="st1" />
      <path d="M86.4 442.1 3.8 394.5V102.1l246.9 141.4.1 94.5-165.7-95.7z" className="st2" />
    </svg>
  )
}
