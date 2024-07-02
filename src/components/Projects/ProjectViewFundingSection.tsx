import classNames from 'classnames'

import { Vesting, VestingStatus } from '../../clients/VestingData.ts'
import { VESTING_DASHBOARD_URL } from '../../constants'
import useFormatMessage, { FormatMessageFunction } from '../../hooks/useFormatMessage.ts'
import { Project } from '../../types/proposals.ts'
import Time from '../../utils/date/Time.ts'
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

const SECONDS_PER_PERIOD = 2628000

function getNextVestingStep(vesting: Vesting, t: FormatMessageFunction) {
  const startDate = Time(vesting.start_at)
  const finishDate = Time(vesting.finish_at)
  const now = Time()

  const secondsSinceStart = now.diff(startDate, 'second')
  const periodsElapsed = Math.floor(secondsSinceStart / SECONDS_PER_PERIOD)
  const nextVestingDate = startDate.add((periodsElapsed + 1) * SECONDS_PER_PERIOD, 'second')
  const daysForRelease = nextVestingDate.diff(now, 'day')
  const nextVestingStepDate =
    daysForRelease < 1
      ? { time: nextVestingDate.diff(now, 'hours'), unit: 'hours' }
      : { time: nextVestingDate.diff(now, 'day'), unit: 'days' }

  const totalDuration = finishDate.diff(startDate, 'second')
  const numberOfPeriods = Math.floor(totalDuration / SECONDS_PER_PERIOD)
  const vestedPerPeriod = vesting.total / numberOfPeriods
  const amountForNextStep = periodsElapsed >= numberOfPeriods ? 0 : vestedPerPeriod

  return { ...nextVestingStepDate, amount: t(`general.number`, { value: amountForNextStep.toFixed(0) }) }
}

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
            <Text size="md" color="default" weight="semi-bold">
              {t('project.general_info.funding.title', {
                total: project.funding.vesting
                  ? `${t(`general.number`, { value: project.funding.vesting?.total })} ${
                      project.funding.vesting?.token
                    }`
                  : '',
              })}
            </Text>
            {compact && funding && <VestingProgressDatesText funding={funding} />}
            {project.funding.vesting && project.funding.vesting.status === VestingStatus.InProgress && (
              <Text size="sm" color="secondary" weight="normal">
                {t('project.general_info.funding.next_vested', {
                  ...getNextVestingStep(project.funding.vesting, t),
                })}
              </Text>
            )}
          </div>
          <VestingProgress
            projectFunding={project.funding}
            className="ProjectViewFundingSection__VestingProgress"
            compact={compact}
          />
        </div>
        <ProjectSectionTitle text={t('project.general_info.funding.vestings')} />
        <ProjectInfoCardsContainer slim>
          {vesting_addresses
            .slice()
            .reverse()
            .map((vesting, index) => {
              return (
                <ProjectViewLinkItem
                  href={VESTING_DASHBOARD_URL + vesting}
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
