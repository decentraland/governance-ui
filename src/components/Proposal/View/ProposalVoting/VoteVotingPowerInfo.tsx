import useFormatMessage from '../../../../hooks/useFormatMessage'
import { Vote } from '../../../../types/votes'
import Text from '../../../Common/Typography/Text'

interface VoteVotingPowerInfoProps {
  accountVotingPower: number
  canVote: boolean
  vote: Vote | null
}

const VoteVotingPowerInfo = ({ accountVotingPower, canVote, vote }: VoteVotingPowerInfoProps) => {
  const t = useFormatMessage()

  function vpLabel(value: number) {
    return (
      <Text as="span" weight="bold" size="sm">
        {t(`general.number`, { value: value })} VP
      </Text>
    )
  }

  return (
    <>
      {canVote &&
        (vote
          ? t('page.proposal_detail.voted_with', { vp: vpLabel(accountVotingPower) })
          : t('page.proposal_detail.voting_with', { vp: vpLabel(accountVotingPower) }))}
      {!canVote && t('page.proposal_detail.no_vp_on_proposal')}
    </>
  )
}

export default VoteVotingPowerInfo
