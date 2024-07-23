import { useIntl } from 'react-intl'

import { Card } from 'decentraland-ui/dist/components/Card/Card'
import { NotMobile } from 'decentraland-ui/dist/components/Media/Media'

import { getRoundedPercentage } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import { GrantTierType, ProjectStatus } from '../../types/grants'
import { ProposalProject } from '../../types/proposals'
import { abbreviateTimeDifference, formatDate } from '../../utils/date/Time'
import locations from '../../utils/locations'
import { isProposalInCliffPeriod } from '../../utils/proposal'
import { isSameAddress } from '../../utils/snapshot.ts'
import Mobile from '../Common/MediaQuery/Mobile.tsx'
import Link from '../Common/Typography/Link'
import Markdown from '../Common/Typography/Markdown.tsx'
import Username from '../Common/Username'
import ChevronRightCircleOutline from '../Icon/ChevronRightCircleOutline'
import CliffProgress from '../Projects/ProjectCard/CliffProgress'
import ProjectFundingProgressBarTooltip from '../Projects/ProjectCard/ProgressBarTooltip'
import VestingProgress from '../Projects/ProjectCard/VestingProgress'
import ProjectPill from '../Projects/ProjectPill'
import ProjectRolePill, { RoleInProject } from '../Projects/ProjectRolePill.tsx'
import ProjectStatusPill from '../Projects/ProjectStatusPill.tsx'

import './ParticipatedProjectItem.css'

interface Props {
  proposalProject: ProposalProject
  address: string
}

const TRANSPARENCY_TIERS_IN_MANA: string[] = [GrantTierType.Tier1, GrantTierType.Tier2, GrantTierType.Tier3]

function getAuthorship(address: string, proposalProject: ProposalProject) {
  if (isSameAddress(address, proposalProject.user)) {
    return RoleInProject.Author
  }
  if (proposalProject.coAuthors?.some((coauthor) => isSameAddress(address, coauthor))) {
    return RoleInProject.Coauthor
  }
  throw new Error('Unable to determine user role in project')
}

function ParticipatedProjectItem({ proposalProject, address }: Props) {
  const t = useFormatMessage()
  const intl = useIntl()
  const { user, title, funding, configuration, status } = proposalProject
  const { vesting, one_time_payment, enacted_at } = funding || {}
  const { vested } = vesting || {}
  const token = vesting ? vesting.token : one_time_payment?.token
  const total = vesting?.total || 100
  const vestedPercentage = vesting ? getRoundedPercentage(vesting.vested, total) : 100
  const proposalInCliffPeriod = !!enacted_at && isProposalInCliffPeriod(enacted_at)
  const isInMana = TRANSPARENCY_TIERS_IN_MANA.includes(configuration.tier)
  const formattedEnactedDate = enacted_at ? formatDate(new Date(enacted_at)) : null
  const href = proposalProject?.project_id
    ? locations.project({ id: proposalProject?.project_id })
    : locations.proposal(proposalProject.id)

  const amount = intl.formatNumber(proposalProject.size)
  const dateText = t(`component.project_card.date_label.${status}`, { date: formattedEnactedDate })
  const budgetText = t('component.project_card.budget_label', {
    amount: amount,
    token: isInMana ? 'USD' : token,
  })
  const vestingText =
    (vested !== undefined &&
      total &&
      t('component.project_card.vested_label', {
        amount: vested,
        percentage: vestedPercentage,
      })) ||
    ''

  const showFundingProgress = !(
    proposalProject.status === ProjectStatus.Finished || proposalProject.status === ProjectStatus.Pending
  )

  const isMember = !!proposalProject.personnel?.some((personnel) => isSameAddress(address, personnel.address))

  return (
    <Card as={Link} className="ParticipatedProjectItem" href={href}>
      <Card.Content>
        <NotMobile>
          <div className="ParticipatedProjectItem__Section">
            <Username className="ParticipatedProjectItem__Avatar" address={user} variant="avatar" size="md" />
            <div>
              <h3 className="ParticipatedProjectItem__Title">{title}</h3>
              <div className="ParticipatedProjectItem__DetailsContainer">
                {status && <ProjectStatusPill status={status} />}
                <ProjectRolePill role={getAuthorship(address, proposalProject)} />
                {isMember && <ProjectRolePill role={RoleInProject.Member} />}
                {formattedEnactedDate && (
                  <Markdown
                    className="ParticipatedProjectItem__Details"
                    size="xs"
                    componentsClassNames={{
                      p: 'ParticipatedProjectItem__DetailsText',
                      strong: 'ParticipatedProjectItem__DetailsStrongText',
                    }}
                  >
                    {dateText + ' ' + (status !== ProjectStatus.Revoked ? budgetText : vestingText)}
                  </Markdown>
                )}
              </div>
            </div>
          </div>
          <div className="ParticipatedProjectItem__CategorySection">
            <div className="ParticipatedProjectItem__PillContainer">
              <ProjectPill type={proposalProject.configuration.category} />
            </div>
            {proposalProject.funding && showFundingProgress && (
              <div className="ParticipatedProjectItem__VestingProgressContainer">
                <ProjectFundingProgressBarTooltip funding={proposalProject.funding} isInCliff={proposalInCliffPeriod}>
                  <div>
                    {proposalInCliffPeriod ? (
                      <CliffProgress enactedAt={enacted_at} basic />
                    ) : (
                      <VestingProgress projectFunding={proposalProject.funding} basic />
                    )}
                  </div>
                </ProjectFundingProgressBarTooltip>
              </div>
            )}
            <ChevronRightCircleOutline />
          </div>
        </NotMobile>
        <Mobile className="ParticipatedProjectItem__Section">
          <div className="ParticipatedProjectItem__Section">
            <div className="ParticipatedProjectItem__GrantInfo">
              <h3 className="ParticipatedProjectItem__Title">{title}</h3>
              <div className="ParticipatedProjectItem__Details">
                <ProjectPill type={proposalProject.configuration.category} />
                {formattedEnactedDate && (
                  <Markdown
                    size="xs"
                    componentsClassNames={{
                      p: 'ParticipatedProjectItem__DetailsText',
                      strong: 'ParticipatedProjectItem__DetailsStrongText',
                    }}
                  >
                    {t('page.profile.projects.item_short_description', {
                      time: abbreviateTimeDifference(formattedEnactedDate),
                      amount: intl.formatNumber(proposalProject.size),
                      token: isInMana ? 'USD' : token,
                    })}
                  </Markdown>
                )}
              </div>
            </div>
          </div>
          <ChevronRightCircleOutline />
        </Mobile>
      </Card.Content>
    </Card>
  )
}

export default ParticipatedProjectItem
