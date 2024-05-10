import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { useAuthContext } from '../../../context/AuthProvider'
import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProposalAttributes, ProposalProject } from '../../../types/proposals'
import { ProjectHealth, UpdateAttributes, UpdateStatus } from '../../../types/updates'
import { formatDate } from '../../../utils/date/Time'
import locations from '../../../utils/locations'
import DateTooltip from '../../Common/DateTooltip'
import Link from '../../Common/Typography/Link'
import Text from '../../Common/Typography/Text'
import Username from '../../Common/Username'
import ChevronRightCircleOutline from '../../Icon/ChevronRightCircleOutline'

import { getStatusIcon } from './ProposalUpdate'
import './ProposalUpdate.css'
import UpdateMenu from './UpdateMenu'

interface Props {
  proposal: ProposalAttributes | ProposalProject
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

const CollapsedProposalUpdate = ({
  proposal,
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

  const isAllowedToPostUpdate = account && (proposal.user === account || isCoauthor)
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
        'ProposalUpdate',
        status === UpdateStatus.Pending && 'ProposalUpdate--pending',
        !completion_date && 'ProposalUpdate--missed'
      )}
    >
      <div className="ProposalUpdate__Left">
        <div className="ProposalUpdate__IconContainer">
          <UpdateIcon size="40" />
        </div>
        <div className="ProposalUpdate__Description">
          <Text as="span" className="ProposalUpdate__Index" weight="medium">
            {showHealth ? (
              <>
                {t('page.proposal_update.health_label')}: {t(getHealthTextKey(health))}
              </>
            ) : (
              t('page.proposal_detail.grant.update_index', { index })
            )}
          </Text>
          {completion_date && (
            <div className="ProposalUpdate__Details">
              <Text as="span" className="ProposalUpdate__DateText">
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
        <div className="ProposalUpdate__Date">
          {isAllowedToPostUpdate && (
            <div className="ProposalUpdate__Menu">
              <UpdateMenu author={update.author} onEditClick={onEditClick} onDeleteClick={onDeleteUpdateClick} />
            </div>
          )}
          <ChevronRightCircleOutline />
        </div>
      )}
    </Component>
  )
}

export default CollapsedProposalUpdate
