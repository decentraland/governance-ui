import classNames from 'classnames'

import useFormatMessage from '../../hooks/useFormatMessage'
import { ProjectStatus } from '../../types/grants'
import Text from '../Common/Typography/Text'
import CheckCircle from '../Icon/CheckCircle'
import CrossCircle from '../Icon/CrossCircle'
import InProgress from '../Icon/InProgress'
import PauseCircle from '../Icon/PauseCircle'

import './ProjectStatusCard.css'

interface Props {
  status: ProjectStatus
}

const getStatusDetails = (status: ProjectStatus) => {
  switch (status) {
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

function ProjectStatusCard({ status }: Props) {
  const { Icon, titleKey } = getStatusDetails(status)
  const t = useFormatMessage()
  return (
    <div className={classNames(['ProjectStatusCard', `ProjectStatusCard--${status}`])}>
      <div className="ProjectStatusCard__IconContainer">
        <Icon size="24" />
      </div>
      <Text as="span" className="ProjectStatusCard__Title" weight="medium">
        {t(titleKey)}
      </Text>
    </div>
  )
}

export default ProjectStatusCard
