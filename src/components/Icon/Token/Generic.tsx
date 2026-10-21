// Fallback for tokens without a dedicated icon: a short label in a neutral circle.
// Short symbols are shown whole (SAFE); wrapped or vault tokens show the asset they track (stETH -> ETH,
// cbBTC -> BTC, steakUSDC -> USDC); anything else, its first letters.
export function getGenericTokenLabel(symbol: string) {
  const clean = symbol.replace(/[^a-z0-9]/gi, '')
  if (clean.length <= 4) {
    return clean.toUpperCase()
  }

  const trackedAsset = clean.match(/[A-Z]{2,4}$/)
  return trackedAsset ? trackedAsset[0] : clean.slice(0, 3).toUpperCase()
}

const FONT_SIZE_BY_LENGTH: Record<number, number> = { 1: 220, 2: 190, 3: 150, 4: 120 }

export default function Generic({ symbol, size = 45 }: { symbol: string; size?: number }) {
  const label = getGenericTokenLabel(symbol)

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 500 500" aria-hidden="true">
      <circle cx={250} cy={250} r={250} fill="#ECEBED" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={FONT_SIZE_BY_LENGTH[label.length] || 120}
        fontWeight={600}
        fill="#736E7D"
      >
        {label}
      </text>
    </svg>
  )
}
