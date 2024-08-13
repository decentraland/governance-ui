import { useIntl } from 'react-intl'

import { Card } from 'decentraland-ui/dist/components/Card/Card'
import { Mobile, NotMobile } from 'decentraland-ui/dist/components/Media/Media'

import { getRoundedPercentage } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import { GrantTierType, ProjectStatus } from '../../types/grants'
import { UserProject } from '../../types/projects.ts'
import { abbreviateTimeDifference, formatDate } from '../../utils/date/Time'
import locations from '../../utils/locations'
import { isProposalInCliffPeriod } from '../../utils/proposal'
import { isSameAddress } from '../../utils/snapshot.ts'
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
  userProject: UserProject
  address: string
}

const TRANSPARENCY_TIERS_IN_MANA: string[] = [GrantTierType.Tier1, GrantTierType.Tier2, GrantTierType.Tier3]

function getAuthorship(address: string, userProject: UserProject) {
  if (isSameAddress(address, userProject.user)) {
    return RoleInProject.Author
  }
  if (userProject.coauthors?.some((coauthor) => isSameAddress(address, coauthor))) {
    return RoleInProject.Coauthor
  }
  throw new Error('Unable to determine user role in project')
}

function ParticipatedProjectItem({ userProject, address }: Props) {
  const t = useFormatMessage()
  const intl = useIntl()
  const { author: user, title, funding, configuration, status, id, proposal_id } = userProject
  const { vesting, one_time_payment, enacted_at } = funding || {}
  const { vested } = vesting || {}
  const token = vesting ? vesting.token : one_time_payment?.token
  const total = vesting?.total || 100
  const vestedPercentage = vesting ? getRoundedPercentage(vesting.vested, total) : 100
  const proposalInCliffPeriod = !!enacted_at && isProposalInCliffPeriod(enacted_at)
  const isInMana = TRANSPARENCY_TIERS_IN_MANA.includes(configuration.tier)
  const formattedEnactedDate = enacted_at ? formatDate(new Date(enacted_at)) : null //TODO: if its finished, use vesting end date
  const href = id ? locations.project({ id }) : locations.proposal(proposal_id)

  const amount = intl.formatNumber(userProject.configuration.size)
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
    userProject.status === ProjectStatus.Finished || userProject.status === ProjectStatus.Pending
  )

  const isMember = !!userProject.personnel?.some((personnel) => isSameAddress(address, personnel.address))

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
                <ProjectRolePill role={getAuthorship(address, userProject)} />
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
              <ProjectPill type={userProject.configuration.category} />
            </div>
            {userProject.funding && showFundingProgress && (
              <div className="ParticipatedProjectItem__VestingProgressContainer">
                <ProjectFundingProgressBarTooltip funding={userProject.funding} isInCliff={proposalInCliffPeriod}>
                  <div>
                    {proposalInCliffPeriod ? (
                      <CliffProgress enactedAt={enacted_at} basic />
                    ) : (
                      <VestingProgress projectFunding={userProject.funding} basic />
                    )}
                  </div>
                </ProjectFundingProgressBarTooltip>
              </div>
            )}
            <ChevronRightCircleOutline />
          </div>
        </NotMobile>
        <Mobile>
          <div className="ParticipatedProjectItem__Section">
            <div className="ParticipatedProjectItem__GrantInfo">
              <h3 className="ParticipatedProjectItem__Title">{title}</h3>
              <div className="ParticipatedProjectItem__Details">
                <ProjectPill type={userProject.configuration.category} />
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
                      amount: intl.formatNumber(userProject.configuration.size),
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
