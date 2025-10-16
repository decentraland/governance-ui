import ThumbDownCircle from '../ThumbDownCircle'

interface Props {
  size?: number
}

function CouncilDecisionVeto({ size = 48 }: Props) {
  return <ThumbDownCircle size={String(size)} />
}

export default CouncilDecisionVeto
