export default function Dai({ size = 45 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      id="dai"
      enableBackground="new 0 0 500 500"
      width={size}
      height={size}
      viewBox="0 0 500 500"
    >
      <linearGradient id="a" x1={73.223} x2={426.777} y1={73.223} y2={426.777} gradientUnits="userSpaceOnUse">
        <stop
          offset={0}
          style={{
            stopColor: '#f9af1a',
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#fbc349',
          }}
        />
      </linearGradient>
      <circle
        cx={250}
        cy={250}
        r={250}
        style={{
          fill: 'url(#a)',
        }}
      />
      <path
        d="M398.7 209.2H369c-16.6-45-59.8-77.1-110.6-77.1H155.3v77.1h-32.8v27h32.8v28.9h-32.8v27h32.8v75.8h103.1c50.3 0 93.2-31.5 110.1-75.8h30.2v-27h-23.4c.6-4.9 1-10 1-15.1 0-4.7-.3-9.3-.8-13.8h23.3v-27zm-216.4-51.3h75c35.9 0 66.8 21 81.3 51.3H182.3v-51.3zm75 184.2h-75v-50H338c-14.7 29.6-45.3 50-80.7 50zm90.1-94.1v4.1c0 4.4-.3 8.8-.9 13H182.3v-28.9h164.3c.5 3.9.8 7.8.8 11.8z"
        style={{
          fill: '#fff',
        }}
      />
    </svg>
  )
}
