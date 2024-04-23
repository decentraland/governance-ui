export default function Mana({ size = 45 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      id="mana"
      x={0}
      y={0}
      enableBackground="new 0 0 500 500"
      width={size}
      height={size}
      viewBox="0 0 500 500"
    >
      <style>{'.st2,.st7{fill-rule:evenodd;clip-rule:evenodd;fill:#fff}.st7{fill:#ffc95b}'}</style>
      <linearGradient
        id="SVGID_1_"
        x1={-386.964}
        x2={-387.841}
        y1={762.161}
        y2={761.284}
        gradientTransform="matrix(400 0 0 -400 155211 304939)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#ff2d55',
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ffbc5b',
          }}
        />
      </linearGradient>
      <circle
        cx={250}
        cy={250}
        r={247.9}
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: 'url(#SVGID_1_)',
        }}
      />
      <linearGradient
        id="SVGID_2_"
        x1={-384.98}
        x2={-384.98}
        y1={761.038}
        y2={759.799}
        gradientTransform="matrix(125 0 0 -150 48377.7 114319)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#a524b3',
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ff2d55',
          }}
        />
      </linearGradient>
      <path
        d="M177.7 163.3v185.9h154.9L177.7 163.3z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: 'url(#SVGID_2_)',
        }}
      />
      <path d="M22.8 349.1h154.9V163.3L22.8 349.1z" fill="#FFFFFF" />
      <path
        d="M51.7 398.7c14.1 18.7 30.9 35.4 49.6 49.6h297.4c18.7-14.1 35.4-30.9 49.6-49.6H51.7z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: '#fc9965',
        }}
      />
      <path
        d="M101.3 448.3c41.4 31.1 92.9 49.6 148.7 49.6s107.3-18.5 148.7-49.6H101.3z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: '#ff2d55',
        }}
      />
      <linearGradient
        id="SVGID_3_"
        x1={-383.415}
        x2={-383.415}
        y1={760.151}
        y2={758.912}
        gradientTransform="matrix(91.7 0 0 -110 35550.598 83879)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#a524b3',
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ff2d55',
          }}
        />
      </linearGradient>
      <path
        d="M334.6 262.4v136.3h113.6L334.6 262.4z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: 'url(#SVGID_3_)',
        }}
      />
      <path
        d="M334.6 349.1H22.8c7.7 17.7 17.5 34.3 28.9 49.6h283.1v-49.6h-.2z"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          fill: '#ffbc5b',
        }}
      />
      <path d="M221.1 398.7h113.5V262.4L221.1 398.7z" fill="#FFFFFF" />
      <circle cx={334.6} cy={163.3} r={62} className="st7" />
      <circle cx={177.7} cy={95.1} r={31} className="st7" />
    </svg>
  )
}
