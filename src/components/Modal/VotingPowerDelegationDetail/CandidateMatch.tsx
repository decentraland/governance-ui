import useFormatMessage from '../../../hooks/useFormatMessage'
import { MatchResult } from '../../../utils/snapshot'
import { Stats } from '../../Common/Stats'
import Helper from '../../Helper/Helper'

import './CandidateMatch.css'

interface Props {
  matchingVotes: MatchResult
}

function matchColor(matchingVotes: MatchResult) {
  return { color: `rgb(0, ${Math.round((200 * matchingVotes.percentage) / 100)}, 0)` }
}

function CandidateMatch({ matchingVotes }: Props) {
  const t = useFormatMessage()

  if (!matchingVotes) {
    return null
  }

  return (
    <Stats title={t('modal.vp_delegation.details.stats_match')} className="CandidateMatch">
      <Helper
        text={t('modal.vp_delegation.details.stats_match_helper')}
        position="right center"
        size="14"
        containerClassName="CandidateMatch__Info"
      />
      <div className="CandidateMatch__StatsValue" style={matchColor(matchingVotes)}>
        {matchingVotes.percentage}%
      </div>
    </Stats>
  )
}

export default CandidateMatch
