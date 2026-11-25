/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProposalPageState } from '../../../../pages/proposal'

import { ChoiceButtons } from './ChoiceButtons'

jest.mock('../../../../hooks/useFormatMessage', () => ({
  __esModule: true,
  default: () => (key?: string, values?: Record<string, unknown>) =>
    values?.choice ? `${key} ${values.choice}` : key ?? '',
}))

// Its Semantic UI Popup calls findDOMNode, which only adds React warnings here
jest.mock('../TextWithTooltip', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
}))

const CHOICES = ['yes', 'no']
const STARTED_AT = new Date(Date.now() - 60 * 60 * 1000)
const SELECTED_STATE = {
  selectedChoice: { choice: 'yes', choiceIndex: 1 },
  showVotingError: false,
  retryTimer: 5,
} as ProposalPageState

function renderChoiceButtons(canVote: boolean, onVote = jest.fn(), updatePageState = jest.fn()) {
  render(
    <ChoiceButtons
      choices={CHOICES}
      vote={null}
      votesByChoices={{}}
      totalVotes={0}
      onVote={onVote}
      voteWithSurvey={false}
      castingVote={false}
      proposalPageState={SELECTED_STATE}
      updatePageState={updatePageState}
      startAt={STARTED_AT}
      canVote={canVote}
    />
  )
  return { onVote, updatePageState }
}

function getChoiceButton(choice: string) {
  return screen.getByRole('button', { name: `page.proposal_detail.vote_choice ${choice}` }) as HTMLButtonElement
}

function getCastVoteButton() {
  return screen.getByRole('button', { name: 'page.proposal_detail.cast_vote' }) as HTMLButtonElement
}

describe('ChoiceButtons', () => {
  describe('when the account can vote', () => {
    it('lets it pick a choice and cast the vote', async () => {
      const { onVote, updatePageState } = renderChoiceButtons(true)

      await userEvent.click(getChoiceButton('no'))
      await userEvent.click(getCastVoteButton())

      expect(updatePageState).toHaveBeenCalled()
      expect(onVote).toHaveBeenCalledWith(SELECTED_STATE.selectedChoice)
    })
  })

  describe('when the account has no VP on the proposal', () => {
    it('disables every choice and the cast button', async () => {
      const { onVote, updatePageState } = renderChoiceButtons(false)

      CHOICES.forEach((choice) => expect(getChoiceButton(choice).disabled).toBe(true))
      expect(getCastVoteButton().disabled).toBe(true)

      await userEvent.click(getChoiceButton('no'))
      await userEvent.click(getCastVoteButton())
      expect(updatePageState).not.toHaveBeenCalled()
      expect(onVote).not.toHaveBeenCalled()
    })
  })
})
