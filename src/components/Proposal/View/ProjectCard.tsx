import { useIntl } from 'react-intl'

import { Desktop } from 'decentraland-ui/dist/components/Media/Media'

import { CURRENCY_FORMAT_OPTIONS } from '../../../helpers'
import useFormatMessage from '../../../hooks/useFormatMessage'
import { UserProject } from '../../../types/projects.ts'
import Time from '../../../utils/date/Time'
import ProjectPill from '../../Projects/ProjectPill'
import ProjectStatusPill from '../../Projects/ProjectStatusPill'

import './ProjectCard.css'
import ProposalCardContainer from './ProposalCardContainer'

interface Props {
  project: UserProject
}

export default function ProjectCard({ project }: Props) {
  const t = useFormatMessage()
  const { id, title, funding, configuration, status } = project

  const finishAt = Time(funding?.vesting?.finish_at || 0)
  const startAt = Time(funding?.vesting?.start_at || 0)
  const dateText = finishAt.isBefore(Time())
    ? t('page.proposal_detail.author_details.sidebar.project_ended', {
        date: finishAt.fromNow(),
      })
    : t('page.proposal_detail.author_details.sidebar.project_began', {
        date: startAt.fromNow(),
      })
  const { formatNumber } = useIntl()

  return (
    <ProposalCardContainer id={id} title={title}>
      <div className="ProjectCard__Details">
        {status && <ProjectStatusPill status={status} />}
        <ProjectPill type={configuration.category} style="light" />
        <div className="ProjectCard__BudgetAndDate">
          <span>{formatNumber(configuration.size || 0, CURRENCY_FORMAT_OPTIONS)}</span>
          <Desktop>
            <span>{' · '}</span>
            <span>{dateText}</span>
          </Desktop>
        </div>
      </div>
    </ProposalCardContainer>
  )
}
