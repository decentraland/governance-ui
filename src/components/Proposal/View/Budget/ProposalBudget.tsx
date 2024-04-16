import snakeCase from 'lodash/snakeCase'

import { BudgetWithContestants } from '../../../../types/budgets'
import { ProposalAttributes, ProposalStatus } from '../../../../types/proposals'
import { ContentSection } from '../../../Layout/ContentLayout'

import CategoryTotalCard from './CategoryTotalCard'
import CompetingGrants from './CompetingGrants'
import './ProposalBudget.css'
import RequestedBudgetCard from './RequestedBudgetCard'

interface Props {
  proposal: ProposalAttributes
  budget: BudgetWithContestants
}

export default function ProposalBudget({ proposal, budget }: Props) {
  const grantCategory = proposal.configuration.category
  const contestantsAmount = (budget.categories[snakeCase(grantCategory)]?.contestants.length || 0) - 1
  const isActive = proposal.status === ProposalStatus.Active

  return (
    <ContentSection>
      <div className="ProposalBudget__Row">
        <RequestedBudgetCard proposal={proposal} budget={budget} />
        <CategoryTotalCard proposal={proposal} budget={budget} />
      </div>
      {contestantsAmount > 0 && isActive && (
        <div className="ProposalBudget__Row">
          <CompetingGrants proposal={proposal} budget={budget} />
        </div>
      )}
    </ContentSection>
  )
}
