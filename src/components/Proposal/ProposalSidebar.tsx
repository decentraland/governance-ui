import { useMemo, useState } from 'react'

import { useAuthContext } from '../../context/AuthProvider'
import useAnalyticsTrack from '../../hooks/useAnalyticsTrack'
import useProposalChoices from '../../hooks/useProposalChoices'
import useProposalVotes from '../../hooks/useProposalVotes'
import { ProposalPageState } from '../../pages/proposal'
import { SegmentEvent } from '../../types/events'
import { ProjectStatus } from '../../types/grants.ts'
import { ProposalStatus, ProposalWithProject } from '../../types/proposals'
import { SubscriptionAttributes } from '../../types/subscriptions'
import { Survey } from '../../types/surveyTopics'
import { SelectedVoteChoice, VoteByAddress } from '../../types/votes'
import { calculateResult } from '../../utils/votes/utils'
import { NotDesktop1200 } from '../Layout/Desktop1200'
import CalendarAlertModal from '../Modal/CalendarAlertModal'
import VotesListModal from '../Modal/Votes/VotesListModal'
import ProjectSidebar from '../Projects/ProjectSidebar'

import CalendarAlertButton from './View/CalendarAlertButton'
import ProjectSheetLink from './View/ProjectSheetLink.tsx'
import ProposalCoAuthorStatus from './View/ProposalCoAuthorStatus'
import ProposalDetailSection from './View/ProposalDetailSection'
import ProposalGovernanceSection from './View/ProposalGovernanceSection'
import ProposalThresholdsSummary from './View/ProposalThresholdsSummary'
import SubscribeButton from './View/SubscribeButton'
import VestingContract from './View/VestingContract'

import ProposalActions from './ProposalActions'
import './ProposalSidebar.css'

interface Props {
  proposal: ProposalWithProject | null
  proposalLoading: boolean
  proposalPageState: ProposalPageState
  updatePageState: React.Dispatch<React.SetStateAction<ProposalPageState>>
  castingVote: boolean
  castVote: (selectedChoice: SelectedVoteChoice, survey?: Survey | undefined) => void
  voteWithSurvey: boolean
  voteOnBid: boolean
  subscribing: boolean
  subscribe: (subscribe: boolean) => void
  subscriptions: SubscriptionAttributes[] | null
  subscriptionsLoading: boolean
  votes?: VoteByAddress | null
  isOwner: boolean
  isCoauthor: boolean
  shouldGiveReason?: boolean
  votingSectionRef: React.MutableRefObject<HTMLDivElement | null>
  projectId?: string | null
  projectStatus?: ProjectStatus | null
}

export default function ProposalSidebar({
  proposal,
  proposalLoading,
  proposalPageState,
  updatePageState,
  castingVote,
  castVote,
  voteWithSurvey,
  voteOnBid,
  subscribing,
  subscribe,
  subscriptions,
  subscriptionsLoading,
  isOwner,
  isCoauthor,
  shouldGiveReason,
  votingSectionRef,
  projectId,
  projectStatus,
}: Props) {
  const [account] = useAuthContext()
  const subscribed = useMemo(
    () => !!account && !!subscriptions && !!subscriptions.find((sub) => sub.user === account),
    [account, subscriptions]
  )
  const { votes, isLoadingVotes, segmentedVotes } = useProposalVotes(proposal?.id)
  const { highQualityVotes, lowQualityVotes } = segmentedVotes || {}
  const choices = useProposalChoices(proposal)
  const partialResults = useMemo(() => calculateResult(choices, highQualityVotes || {}), [choices, highQualityVotes])

  const [isVotesListModalOpen, setIsVotesListModalOpen] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const track = useAnalyticsTrack()
  const setIsCalendarModalOpenWithTracking = (isOpen: boolean) => {
    setIsCalendarModalOpen(isOpen)
    if (isOpen) {
      track(SegmentEvent.ModalViewed, { address: account, modal: 'Calendar Alert' })
    }
  }

  const handleVoteClick = (selectedChoice: SelectedVoteChoice) => {
    if (voteWithSurvey || shouldGiveReason) {
      updatePageState((prevState) => ({
        ...prevState,
        selectedChoice,
        showVotingModal: true,
      }))
    } else if (voteOnBid) {
      updatePageState((prevState) => ({
        ...prevState,
        selectedChoice,
        showBidVotingModal: true,
      }))
    } else {
      castVote(selectedChoice)
    }
  }

  const handleChoiceClick = () => {
    setIsVotesListModalOpen(true)
  }

  const showProposalThresholdsSummary = !!(
    proposal &&
    proposal?.required_to_pass !== null &&
    proposal?.required_to_pass >= 0 &&
    proposal.status !== ProposalStatus.Pending &&
    !(proposal.status === ProposalStatus.Passed)
  )

  const showVestingContract = proposal?.vesting_addresses && proposal?.vesting_addresses.length > 0
  const isCalendarButtonDisabled = !proposal || proposal.status !== ProposalStatus.Active
  const hasProject = !!projectId && !!projectStatus
  const isGrantee = isOwner || isCoauthor
  const [showProjectSidebar, setShowProjectSidebar] = useState(false)

  return (
    <>
      {hasProject && (
        <>
          <ProjectSheetLink
            projectStatus={projectStatus}
            isGrantee={isGrantee}
            onClick={() => setShowProjectSidebar(true)}
          />
          <ProjectSidebar
            projectId={projectId}
            isSidebarVisible={showProjectSidebar}
            onClose={() => setShowProjectSidebar(false)}
          />
        </>
      )}
      {showVestingContract && <VestingContract vestingAddresses={proposal.vesting_addresses} />}
      {proposal && <ProposalCoAuthorStatus proposalId={proposal.id} proposalFinishDate={proposal.finish_at} />}
      <div className="ProposalSidebar">
        <div ref={votingSectionRef}>
          <ProposalGovernanceSection
            disabled={!proposal || !votes}
            loading={proposalLoading || isLoadingVotes}
            proposal={proposal}
            votes={votes}
            partialResults={partialResults}
            choices={choices}
            voteWithSurvey={voteWithSurvey}
            castingVote={castingVote}
            onChangeVote={(_, changing) => updatePageState((prevState) => ({ ...prevState, changingVote: changing }))}
            onVote={handleVoteClick}
            onChoiceClick={handleChoiceClick}
            updatePageState={updatePageState}
            proposalPageState={proposalPageState}
          />
        </div>
        {showProposalThresholdsSummary && (
          <ProposalThresholdsSummary proposal={proposal} partialResults={partialResults} />
        )}
        <SubscribeButton
          loading={proposalLoading || subscriptionsLoading || subscribing}
          disabled={!proposal}
          subscribed={subscribed}
          onClick={() => subscribe(!subscribed)}
        />
        <CalendarAlertButton
          loading={proposalLoading}
          disabled={isCalendarButtonDisabled}
          onClick={() => setIsCalendarModalOpenWithTracking(true)}
        />
        {proposal && (
          <>
            <NotDesktop1200>
              <ProposalDetailSection proposal={proposal} />
            </NotDesktop1200>
            <ProposalActions proposal={proposal} />
            <CalendarAlertModal
              proposal={proposal}
              open={isCalendarModalOpen}
              onClose={() => setIsCalendarModalOpenWithTracking(false)}
            />
            <VotesListModal
              open={isVotesListModalOpen}
              proposal={proposal}
              highQualityVotes={highQualityVotes}
              lowQualityVotes={lowQualityVotes}
              onClose={() => setIsVotesListModalOpen(false)}
            />
          </>
        )}
      </div>
    </>
  )
}
