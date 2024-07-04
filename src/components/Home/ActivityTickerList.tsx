import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'

import useFormatMessage from '../../hooks/useFormatMessage'
import { type ActivityTickerEvent, EventType } from '../../types/events'
import locations from '../../utils/locations'
import Avatar from '../Common/Avatar'
import DateTooltip from '../Common/DateTooltip'
import Empty from '../Common/Empty'
import Link from '../Common/Typography/Link'
import DelegationEvent from '../Events/DelegationEvent'
import ProjectUpdateCommentedEvent from '../Events/ProjectUpdateCommentedEvent'
import ProposalRelatedEvent from '../Events/ProposalRelatedEvent'
import CircledComment from '../Icon/CircledComment'

import './ActivityTickerList.css'

interface Props {
  isLoading: boolean
  events?: ActivityTickerEvent[]
}

function getActivityTickerEvent(event: ActivityTickerEvent) {
  if (event.event_type === EventType.DelegationClear || event.event_type === EventType.DelegationSet) {
    return <DelegationEvent event={event} />
  }
  if (event.event_type === EventType.ProjectUpdateCommented) return <ProjectUpdateCommentedEvent event={event} />
  return <ProposalRelatedEvent event={event} />
}

function getActivityTickerImage(item: ActivityTickerEvent) {
  if (!!item.address && item.event_type !== EventType.ProposalCommented) {
    return (
      <Link href={locations.profile({ address: item.address })}>
        <Avatar size="xs" avatar={item.avatar} address={item.address} />
      </Link>
    )
  }
  if (item.event_type === EventType.ProposalCommented || item.event_type === EventType.ProjectUpdateCommented) {
    return (
      <div>
        <CircledComment />
      </div>
    )
  }
}

function ActivityTickerList({ isLoading, events }: Props) {
  const t = useFormatMessage()
  return (
    <>
      {isLoading && (
        <div className="ActivityTickerList__LoadingContainer">
          <Loader active />
        </div>
      )}
      {!isLoading && (
        <>
          {events && events.length === 0 && (
            <div className="Empty__Container">
              <Empty description={t('page.home.activity_ticker.no_activity')} />
            </div>
          )}
          {events && events.length > 0 && (
            <div className="ActivityTickerList">
              {events.map((item) => {
                return (
                  <div key={item.id} className="ActivityTickerList__Item">
                    {getActivityTickerImage(item)}
                    <DateTooltip date={item.created_at}>{getActivityTickerEvent(item)}</DateTooltip>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default ActivityTickerList
