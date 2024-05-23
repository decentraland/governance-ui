import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProjectHealth, UpdateAttributes, UpdateStatus } from '../../../types/updates'
import { formatDate } from '../../../utils/date/Time'
import locations from '../../../utils/locations'
import DateTooltip from '../../Common/DateTooltip'
import Link from '../../Common/Typography/Link'
import Text from '../../Common/Typography/Text'
import Username from '../../Common/Username'
import ChevronRightCircleOutline from '../../Icon/ChevronRightCircleOutline'
import LateClock from '../../Icon/LateClock'
import ThumbDownCircle from '../../Icon/ThumbDownCircle'
import ThumbUpCircle from '../../Icon/ThumbUpCircle'
import Warning from '../../Icon/Warning'

import './ProjectUpdateCard.css'
import UpdateMenu from './UpdateMenu'

interface Props {
  update: UpdateAttributes
  isAllowedToPostUpdate: boolean
  index?: number
  isLinkable?: boolean
  onEditClick: () => void
  onDeleteUpdateClick: () => void
}

export const getStatusIcon = (
  health: UpdateAttributes['health'],
  completion_date: UpdateAttributes['completion_date']
) => {
  if (!completion_date) {
    return Warning
  }

  switch (health) {
    case ProjectHealth.OnTrack:
      return ThumbUpCircle
    case ProjectHealth.AtRisk:
      return Warning
    case ProjectHealth.OffTrack:
    default:
      return ThumbDownCircle
  }
}

const ProjectUpdateCard = ({
  update,
  isAllowedToPostUpdate,
  index,
  isLinkable,
  onEditClick,
  onDeleteUpdateClick,
}: Props) => {
  const t = useFormatMessage()
  const navigate = useNavigate()

  const { status, health, completion_date, author } = update
  const updateLocation = locations.update(update.id)
  const Component = isLinkable && completion_date ? Link : 'div'
  const UpdateIcon = getStatusIcon(health, completion_date)

  const formattedCompletionDate = completion_date ? formatDate(completion_date) : ''

  const handleUpdateClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
      if (update.completion_date) {
        e.stopPropagation()
        e.preventDefault()
        navigate(updateLocation)
      }
    },
    [update.completion_date, updateLocation, navigate]
  )

  return (
    <Component
      href={completion_date ? updateLocation : undefined}
      onClick={isLinkable ? undefined : handleUpdateClick}
      className={classNames(
        'ProjectUpdateCard',
        status === UpdateStatus.Pending && 'ProjectUpdateCard--pending',
        !completion_date && 'ProjectUpdateCard--missed'
      )}
    >
      <div className="ProjectUpdateCard__Left">
        <div className="ProjectUpdateCard__IconContainer">
          <UpdateIcon size="40" className={classNames(!completion_date && 'ProjectUpdateCard__Icon--missed')} />
          {status === UpdateStatus.Late && <LateClock className="ProjectUpdateCard__LateClock" />}
        </div>
        <div className="ProjectUpdateCard__Description">
          <Text
            as="span"
            className={classNames('ProjectUpdateCard__Index', !completion_date && 'ProjectUpdateCard__Index--missed')}
            weight="medium"
          >
            {t('page.proposal_detail.grant.update_index', { index })}
          </Text>
          <div className="ProjectUpdateCard__Details">
            {completion_date ? (
              <>
                <Text size="sm" as="span" className="ProjectUpdateCard__DateText">
                  <DateTooltip date={completion_date}>
                    {t(
                      `page.update_detail.${status === UpdateStatus.Late ? 'late_completion_date' : 'completion_date'}`,
                      { date: formattedCompletionDate }
                    )}
                  </DateTooltip>
                </Text>
                <>{author && <Username size="xxs" address={author} />}</>
              </>
            ) : (
              <Text as="span" size="sm" className="ProjectUpdateCard__DateText">
                {t('page.update_detail.failed_update')}
              </Text>
            )}
          </div>
        </div>
      </div>
      {completion_date && (
        <div className="ProjectUpdateCard__Date">
          {isAllowedToPostUpdate && (
            <div className="ProjectUpdateCard__Menu">
              <UpdateMenu author={update.author} onEditClick={onEditClick} onDeleteClick={onDeleteUpdateClick} />
            </div>
          )}
          <ChevronRightCircleOutline />
        </div>
      )}
    </Component>
  )
}

export default ProjectUpdateCard
