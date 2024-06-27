import classNames from 'classnames'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { Project } from '../../types/proposals.ts'
import Text from '../Common/Typography/Text.tsx'
import VestingLinkIcon from '../Icon/VestingLinkIcon.tsx'

import VestingProgress from './ProjectCard/VestingProgress.tsx'
import VestingProgressDatesText from './ProjectCard/VestingProgressDatesText.tsx'

import ProjectInfoCardsContainer from './ProjectInfoCardsContainer.tsx'
import ProjectSectionsContainer from './ProjectSectionsContainer.tsx'
import './ProjectSheetFundingSection.css'
import ProjectSheetLinkItem from './ProjectSheetLinkItem.tsx'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle.tsx'

interface Props {
  project: Project
  compact?: boolean
  className?: string
}

const VESTINGS_BASE_URL = 'https://decentraland.org/vesting/#/'

function getVestingLinkLabel(index: number, thereIsMoreThanOnePastVesting: boolean) {
  return `${index === 0 ? 'Current' : 'Past'} vesting ${thereIsMoreThanOnePastVesting && index > 0 ? `${index}` : ''}`
}

function ProjectSheetFundingSection({ project, compact, className }: Props) {
  const { vesting_addresses, funding } = project
  const thereIsMoreThanOnePastVesting = vesting_addresses.length > 2

  const t = useFormatMessage()
  return project.funding ? (
    <ProjectSectionsContainer>
      <div className={classNames(['ProjectSheetFundingSection', className])}>
        <div className="ProjectSheetFundingSection__FundingBox">
          <div className="ProjectSheetFundingSection__Heading">
            <Text size="md" color="default" weight="medium">
              {t('project.sheet.general_info.funding', {
                total: project.funding.vesting
                  ? `${project.funding.vesting?.total} ${project.funding.vesting?.token}`
                  : '',
              })}
            </Text>
            {compact && funding && <VestingProgressDatesText funding={funding} />}
          </div>
          <VestingProgress
            projectFunding={project.funding}
            className="ProjectSheetFundingSection__VestingProgress"
            compact={compact}
          />
        </div>
        <ProjectSidebarSectionTitle text={'Vesting Contracts'} />
        <ProjectInfoCardsContainer slim>
          {vesting_addresses
            .slice()
            .reverse()
            .map((vesting, index) => {
              return (
                <ProjectSheetLinkItem
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
  ) : null
}

export default ProjectSheetFundingSection
