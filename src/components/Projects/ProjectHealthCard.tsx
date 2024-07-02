import classNames from 'classnames'

import useFormatMessage from '../../hooks/useFormatMessage'
import { ProjectHealth } from '../../types/updates'
import { formatDate } from '../../utils/date/Time'
import DateTooltip from '../Common/DateTooltip'
import Link from '../Common/Typography/Link'
import Text from '../Common/Typography/Text'
import ChevronRightCircleOutline from '../Icon/ChevronRightCircleOutline'
import ThumbDownCircle from '../Icon/ThumbDownCircle'
import ThumbUpCircle from '../Icon/ThumbUpCircle'
import Warning from '../Icon/Warning'

import './ProjectHealthCard.css'

interface Props {
  status: ProjectHealth
  date: Date
  href: string
}

const getStatusDetails = (status: ProjectHealth) => {
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
  }
}

function ProjectHealthCard({ status, date, href }: Props) {
  const { Icon, titleKey } = getStatusDetails(status)
  const t = useFormatMessage()
  return (
    <Link href={href} className={classNames(['ProjectHealthCard', `ProjectHealthCard--${status}`])}>
      <div className="ProjectHealthCard__Left">
        <div className="ProjectHealthCard__IconContainer">
          <Icon size="40" />
        </div>
        <div className="ProjectHealthCard__Description">
          <Text as="span" className="ProjectHealthCard__Title" weight="medium">
            {t(titleKey)}
          </Text>
          <div className="ProjectHealthCard__Date">
            <Text size="sm" as="span" className="ProjectHealthCard__DateText">
              <DateTooltip date={date}>
                {t('page.project_sidebar.general_info.status_card.reported', {
                  date: formatDate(date),
                })}
              </DateTooltip>
            </Text>
          </div>
        </div>
      </div>
      <div className="ProjectUpdateCard__Date">
        <ChevronRightCircleOutline />
      </div>
    </Link>
  )
}

export default ProjectHealthCard
