import { useIntl } from 'react-intl'

import { Card } from 'decentraland-ui/dist/components/Card/Card'
import { Mobile, NotMobile } from 'decentraland-ui/dist/components/Media/Media'

import useFormatMessage from '../../hooks/useFormatMessage'
import { GrantTierType } from '../../types/grants'
import { ProposalProject } from '../../types/proposals'
import { abbreviateTimeDifference, formatDate } from '../../utils/date/Time'
import locations from '../../utils/locations'
import { isProposalInCliffPeriod } from '../../utils/proposal'
import Link from '../Common/Typography/Link'
import Markdown from '../Common/Typography/Markdown'
import Username from '../Common/Username'
import ChevronRightCircleOutline from '../Icon/ChevronRightCircleOutline'
import CliffProgress from '../Projects/ProjectCard/CliffProgress'
import ProgressBarTooltip from '../Projects/ProjectCard/ProgressBarTooltip'
import VestingProgress from '../Projects/ProjectCard/VestingProgress'
import ProjectPill from '../Projects/ProjectPill'

import './GrantBeneficiaryItem.css'
import VestingPill from './VestingPill'

interface Props {
  proposalProject: ProposalProject
}

const TRANSPARENCY_TIERS_IN_MANA: string[] = [GrantTierType.Tier1, GrantTierType.Tier2, GrantTierType.Tier3]

function GrantBeneficiaryItem({ proposalProject }: Props) {
  const t = useFormatMessage()
  const intl = useIntl()
  const { user, title, funding, configuration } = proposalProject

  const { vesting, one_time_payment, enacted_at } = funding!
  const token = vesting ? vesting.token : one_time_payment?.token
  const proposalInCliffPeriod = !!enacted_at && isProposalInCliffPeriod(enacted_at)
  const isInMana = TRANSPARENCY_TIERS_IN_MANA.includes(configuration.tier)
  const formattedEnactedDate = enacted_at ? formatDate(new Date(enacted_at)) : null

  return (
    <Card as={Link} className="GrantBeneficiaryItem" href={locations.proposal(proposalProject.id)}>
      <Card.Content>
        <NotMobile>
          <div className="GrantBeneficiaryItem__Section">
            <Username className="GrantBeneficiaryItem__Avatar" address={user} variant="avatar" size="md" />
            <div>
              <h3 className="GrantBeneficiaryItem__Title">{title}</h3>
              <div className="GrantBeneficiaryItem__DetailsContainer">
                {proposalProject.status && <VestingPill status={proposalProject.status} />}
                {formattedEnactedDate && (
                  <Markdown
                    className="GrantBeneficiaryItem__Details"
                    size="xs"
                    componentsClassNames={{
                      p: 'GrantBeneficiaryItem__DetailsText',
                      strong: 'GrantBeneficiaryItem__DetailsStrongText',
                    }}
                  >
                    {t('page.profile.grants.item_description', {
                      time: formattedEnactedDate,
                      amount: intl.formatNumber(proposalProject.size),
                      token: isInMana ? 'USD' : token,
                    })}
                  </Markdown>
                )}
              </div>
            </div>
          </div>
          <div className="GrantBeneficiaryItem__CategorySection">
            <div className="GrantBeneficiaryItem__PillContainer">
              <ProjectPill type={proposalProject.configuration.category} />
            </div>
            <div className="GrantBeneficiaryItem__VestingProgressContainer">
              <ProgressBarTooltip proposalProject={proposalProject} isInCliff={proposalInCliffPeriod}>
                <div>
                  {proposalInCliffPeriod ? (
                    <CliffProgress enactedAt={enacted_at} basic />
                  ) : (
                    <VestingProgress projectFunding={proposalProject.funding} basic />
                  )}
                </div>
              </ProgressBarTooltip>
            </div>
            <ChevronRightCircleOutline />
          </div>
        </NotMobile>
        <Mobile>
          <div className="GrantBeneficiaryItem__Section">
            <div className="GrantBeneficiaryItem__GrantInfo">
              <h3 className="GrantBeneficiaryItem__Title">{title}</h3>
              <div className="GrantBeneficiaryItem__Details">
                <ProjectPill type={proposalProject.configuration.category} />
                {formattedEnactedDate && (
                  <Markdown
                    size="xs"
                    componentsClassNames={{
                      p: 'GrantBeneficiaryItem__DetailsText',
                      strong: 'GrantBeneficiaryItem__DetailsStrongText',
                    }}
                  >
                    {t('page.profile.grants.item_short_description', {
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

export default GrantBeneficiaryItem
