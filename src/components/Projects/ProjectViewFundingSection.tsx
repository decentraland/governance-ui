import classNames from 'classnames'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { Project } from '../../types/proposals.ts'
import Text from '../Common/Typography/Text.tsx'
import VestingLinkIcon from '../Icon/VestingLinkIcon.tsx'

import VestingProgress from './ProjectCard/VestingProgress.tsx'
import VestingProgressDatesText from './ProjectCard/VestingProgressDatesText.tsx'

import ProjectInfoCardsContainer from './ProjectInfoCardsContainer.tsx'
import ProjectSectionTitle from './ProjectSectionTitle.tsx'
import ProjectSectionsContainer from './ProjectSectionsContainer.tsx'
import './ProjectViewFundingSection.css'
import ProjectViewLinkItem from './ProjectViewLinkItem.tsx'

interface Props {
  project: Project
  compact?: boolean
  className?: string
}

const VESTINGS_BASE_URL = 'https://decentraland.org/vesting/#/'

function getVestingLinkLabel(index: number, thereIsMoreThanOnePastVesting: boolean) {
  return `${index === 0 ? 'Current' : 'Past'} vesting ${thereIsMoreThanOnePastVesting && index > 0 ? `${index}` : ''}`
}

function ProjectViewFundingSection({ project, compact, className }: Props) {
  const { vesting_addresses, funding } = project
  const thereIsMoreThanOnePastVesting = vesting_addresses.length > 2

  const t = useFormatMessage()

  if (!project.funding) {
    return null
  }

  return (
    <ProjectSectionsContainer>
      <div className={classNames(['ProjectViewFundingSection', className])}>
        <div className="ProjectViewFundingSection__FundingBox">
          <div className="ProjectViewFundingSection__Heading">
            <Text size="md" color="default" weight="medium">
              {t('project.general_info.funding', {
                total: project.funding.vesting
                  ? `${project.funding.vesting?.total} ${project.funding.vesting?.token}`
                  : '',
              })}
            </Text>
            {compact && funding && <VestingProgressDatesText funding={funding} />}
          </div>
          <VestingProgress
            projectFunding={project.funding}
            className="ProjectViewFundingSection__VestingProgress"
            compact={compact}
          />
        </div>
        <ProjectSectionTitle text={t('project.general_info.vestings')} />
        <ProjectInfoCardsContainer slim>
          {vesting_addresses
            .slice()
            .reverse()
            .map((vesting, index) => {
              return (
                <ProjectViewLinkItem
                  href={VESTINGS_BASE_URL + vesting}
                  icon={<VestingLinkIcon />}
                  label={getVestingLinkLabel(index, thereIsMoreThanOnePastVesting)}
                  key={`${vesting}${index}`}
                />
              )
            })}
        </ProjectInfoCardsContainer>
      </div>
    </ProjectSectionsContainer>
  )
}

export default ProjectViewFundingSection
