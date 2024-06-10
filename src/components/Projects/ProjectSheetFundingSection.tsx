import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { Project } from '../../types/proposals.ts'
import Link from '../Common/Typography/Link.tsx'
import VestingLinkIcon from '../Icon/VestingLinkIcon.tsx'

import VestingProgress from './ProjectCard/VestingProgress.tsx'

import ProjectInfoCardsContainer from './ProjectInfoCardsContainer.tsx'
import ProjectSectionsContainer from './ProjectSectionsContainer.tsx'
import './ProjectSheetFundingSection.css'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle.tsx'

interface Props {
  project: Project
}

const VESTINGS_BASE_URL = 'https://decentraland.org/vesting/#/'

function getVestingLinkLabel(index: number, thereIsMoreThanOnePastVesting: boolean) {
  return (
    <>{`${index === 0 ? 'Current' : 'Past'} vesting ${thereIsMoreThanOnePastVesting && index > 0 ? `${index}` : ''}`}</>
  )
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
                    <div className="ExpandableBreakdownItem ExpandableBreakdownItem--slim" key={`${vesting}${index}`}>
                      <div className="ExpandableBreakdownItem__Header">
                        <Link
                          className="ExpandableBreakdownItem__Title"
                          href={VESTINGS_BASE_URL + vesting}
                          target="_blank"
                        >
                          <VestingLinkIcon /> {getVestingLinkLabel(index, thereIsMoreThanOnePastVesting)}
                        </Link>
                      </div>
                    </div>
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
