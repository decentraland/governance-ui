import useFormatMessage from '../../hooks/useFormatMessage'
import { ProjectStatus } from '../../types/grants'
import { ProjectHealth } from '../../types/updates'
import { formatDate } from '../../utils/date/Time'
import DateTooltip from '../Common/DateTooltip'
import Link from '../Common/Typography/Link'
import Text from '../Common/Typography/Text'
import CheckCircle from '../Icon/CheckCircle'
import ChevronRightCircleOutline from '../Icon/ChevronRightCircleOutline'
import CrossCircle from '../Icon/CrossCircle'
import InProgress from '../Icon/InProgress'
import PauseCircle from '../Icon/PauseCircle'
import ThumbDownCircle from '../Icon/ThumbDownCircle'
import ThumbUpCircle from '../Icon/ThumbUpCircle'
import Warning from '../Icon/Warning'

import './ProjectStatusCard.css'

interface Props {
  status: ProjectStatus | ProjectHealth
  date: Date
  href?: string
}

const getStatusDetails = (status: Props['status']) => {
  switch (status) {
    case ProjectHealth.OnTrack:
      return {
        Icon: ThumbUpCircle,
        titleKey: 'page.project_sidebar.general_info.status_card.on_track',
      }
    case ProjectHealth.AtRisk:
      return {
        Icon: Warning,
        titleKey: 'page.project_sidebar.general_info.status_card.at_risk',
      }
    case ProjectHealth.OffTrack:
      return {
        Icon: ThumbDownCircle,
        titleKey: 'page.project_sidebar.general_info.status_card.off_track',
      }
    case ProjectStatus.Finished:
      return {
        Icon: CheckCircle,
        titleKey: 'page.project_sidebar.general_info.status_card.finished',
      }
    case ProjectStatus.Revoked:
      return {
        Icon: CrossCircle,
        titleKey: 'page.project_sidebar.general_info.status_card.revoked',
      }
    case ProjectStatus.Paused:
      return {
        Icon: PauseCircle,
        titleKey: 'page.project_sidebar.general_info.status_card.paused',
      }
    case ProjectStatus.InProgress:
    default:
      return {
        Icon: InProgress,
        titleKey: 'page.project_sidebar.general_info.status_card.in_progress',
      }
  }
}

function ProjectStatusCard({ status, date, href }: Props) {
  const Component = href ? Link : 'div'
  const { Icon, titleKey } = getStatusDetails(status)
  const t = useFormatMessage()
  return (
    <Component href={href} className="ProjectStatusCard">
      <div className="ProjectStatusCard__Left">
        <div className="ProjectStatusCard__IconContainer">
          <Icon />
        </div>
        <div className="ProjectStatusCard__Description">
          <Text as="span" className="ProjectStatusCard__Title" weight="medium">
            {t(titleKey)}
          </Text>
          <div className="ProjectStatusCard__Date">
            <Text size="sm" as="span" className="ProjectStatusCard__DateText">
              <DateTooltip date={date}>
                {t(
                  `page.project_sidebar.general_info.status_card.${
                    status === ProjectStatus.InProgress ? 'started' : 'reported'
                  }`,
                  {
                    date: formatDate(date),
                  }
                )}
              </DateTooltip>
            </Text>
          </div>
        </div>
      </div>
      {href && (
        <div className="ProjectUpdateCard__Date">
          <ChevronRightCircleOutline />
        </div>
      )}
    </Component>
  )
}

export default ProjectStatusCard
