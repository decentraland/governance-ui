import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { UpdateAttributes, UpdateStatus } from '../../../types/updates'
import { formatDate } from '../../../utils/date/Time'
import locations from '../../../utils/locations'
import DateTooltip from '../../Common/DateTooltip'
import ChevronRight from '../../Icon/ChevronRight'

import './MiniProjectUpdateCard.css'
import { getStatusIcon } from './ProjectUpdateCard'

interface Props {
  update: UpdateAttributes
  index?: number
}

const MiniProjectUpdateCard = ({ update, index }: Props) => {
  const t = useFormatMessage()
  const navigate = useNavigate()

  const { introduction, status, health, completion_date } = update
  const updateLocation = locations.update(update.id)
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
    <div
      onClick={handleUpdateClick}
      className={classNames(
        'MiniProjectUpdateCard',
        status === UpdateStatus.Pending && 'MiniProjectUpdateCard--pending',
        !completion_date && 'MiniProjectUpdateCard--missed'
      )}
    >
      <div className="MiniProjectUpdateCard__Left">
        <div className="MiniProjectUpdateCard__IconContainer">
          <UpdateIcon size="25" />
        </div>
        <div className="MiniProjectUpdateCard__Description">
          <span className="MiniProjectUpdateCard__Index">
            {t('page.proposal_detail.grant.update_index', { index })}:
          </span>
          <span>{completion_date ? introduction : t('page.proposal_detail.grant.update_missed')}</span>
        </div>
      </div>
      {completion_date && (
        <div className="MiniProjectUpdateCard__Date">
          <span className="MiniProjectUpdateCard__DateText">
            <DateTooltip date={completion_date}>{formattedCompletionDate}</DateTooltip>
          </span>
          {status === UpdateStatus.Late && (
            <span className="MiniProjectUpdateCard__Late">{t('page.proposal_detail.grant.update_late')}</span>
          )}
          <ChevronRight color="var(--black-300)" />
        </div>
      )}
    </div>
  )
}

export default MiniProjectUpdateCard
