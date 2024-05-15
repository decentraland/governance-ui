import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { useAuthContext } from '../../../context/AuthProvider'
import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProjectHealth, UpdateAttributes, UpdateStatus } from '../../../types/updates'
import { formatDate } from '../../../utils/date/Time'
import locations from '../../../utils/locations'
import { isSameAddress } from '../../../utils/snapshot'
import DateTooltip from '../../Common/DateTooltip'
import Link from '../../Common/Typography/Link'
import Text from '../../Common/Typography/Text'
import Username from '../../Common/Username'
import ChevronRightCircleOutline from '../../Icon/ChevronRightCircleOutline'

import { getStatusIcon } from './ProjectUpdateCard'
import './ProjectUpdateCard.css'
import UpdateMenu from './UpdateMenu'

interface Props {
  authorAddress?: string
  update: UpdateAttributes
  index?: number
  isCoauthor?: boolean
  isLinkable?: boolean
  showHealth?: boolean
  onEditClick: () => void
  onDeleteUpdateClick: () => void
}

const getHealthTextKey = (health: UpdateAttributes['health']) => {
  switch (health) {
    case ProjectHealth.OnTrack:
      return 'page.proposal_update.on_track_label'
    case ProjectHealth.AtRisk:
      return 'page.proposal_update.at_risk_label'
    case ProjectHealth.OffTrack:
      return 'page.proposal_update.off_track_label'
  }
}

const CollapsedProjectUpdateCard = ({
  authorAddress,
  update,
  index,
  isCoauthor,
  isLinkable,
  showHealth,
  onEditClick,
  onDeleteUpdateClick,
}: Props) => {
  const t = useFormatMessage()
  const [account] = useAuthContext()
  const navigate = useNavigate()

  const { status, health, completion_date, author } = update
  const updateLocation = locations.update(update.id)
  const Component = isLinkable && completion_date ? Link : 'div'
  const UpdateIcon = getStatusIcon(health, completion_date)

  const isAllowedToPostUpdate = account && (isSameAddress(authorAddress, account) || isCoauthor)
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
          <UpdateIcon size="40" />
        </div>
        <div className="ProjectUpdateCard__Description">
          <Text as="span" className="ProjectUpdateCard__Index" weight="medium">
            {showHealth ? (
              <>
                {t('page.proposal_update.health_label')}: {t(getHealthTextKey(health))}
              </>
            ) : (
              t('page.proposal_detail.grant.update_index', { index })
            )}
          </Text>
          {completion_date && (
            <div className="ProjectUpdateCard__Details">
              <Text as="span" className="ProjectUpdateCard__DateText">
                <DateTooltip date={completion_date}>
                  {t('page.update_detail.completion_date', { date: formattedCompletionDate })}
                </DateTooltip>
              </Text>
              {author && <Username address={author} />}
            </div>
          )}
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

export default CollapsedProjectUpdateCard
