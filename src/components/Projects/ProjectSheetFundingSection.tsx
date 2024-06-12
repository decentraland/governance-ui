import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { Project } from '../../types/proposals.ts'
import VestingLinkIcon from '../Icon/VestingLinkIcon.tsx'

import VestingProgress from './ProjectCard/VestingProgress.tsx'

import ProjectInfoCardsContainer from './ProjectInfoCardsContainer.tsx'
import ProjectSectionsContainer from './ProjectSectionsContainer.tsx'
import './ProjectSheetFundingSection.css'
import ProjectSheetLinkItem from './ProjectSheetLinkItem.tsx'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle.tsx'

interface Props {
  project: Project
}

const VESTINGS_BASE_URL = 'https://decentraland.org/vesting/#/'

function getVestingLinkLabel(index: number, thereIsMoreThanOnePastVesting: boolean) {
  return `${index === 0 ? 'Current' : 'Past'} vesting ${thereIsMoreThanOnePastVesting && index > 0 ? `${index}` : ''}`
}

function ProjectSheetFundingSection({ project }: Props) {
  const { vesting_addresses } = project
  const thereIsMoreThanOnePastVesting = vesting_addresses.length > 2
  const t = useFormatMessage()
  return (
    <>
      {project.funding && (
        <div>
          <ProjectSidebarSectionTitle text={t('project.sheet.general_info.funding')} />
          <ProjectSectionsContainer>
            <VestingProgress projectFunding={project.funding} className="ProjectSheetFundingSection__VestingProgress" />
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
          </ProjectSectionsContainer>
        </div>
      )}
    </>
  )
}

export default ProjectSheetFundingSection
