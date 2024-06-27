import { Loader } from 'decentraland-ui'

import useEvents from '../../hooks/useEvents'
import useFormatMessage from '../../hooks/useFormatMessage'
import { Project } from '../../types/proposals'
import Empty from '../Common/Empty'
import { getActivityTickerEvent, getActivityTickerImage } from '../Home/ActivityTicker'

interface Props {
  project: Project
}

function ActivityTab({ project }: Props) {
  const t = useFormatMessage()
  const { events, isLoading } = useEvents({ proposal_id: project.proposal_id, withInterval: false })
  return (
    <>
      {isLoading && (
        <div className="ActivityTicker__LoadingContainer">
          <Loader active />
        </div>
      )}
      {!isLoading && (
        <>
          {events && events.length === 0 && (
            <div className="ActivityTicker__EmptyContainer">
              <Empty description={t('page.home.activity_ticker.no_activity')} />
            </div>
          )}
          {events && events.length > 0 && (
            <div className="ActivityTicker__List">
              {events.map((item) => {
                return (
                  <div key={item.id} className="ActivityTicker__ListItem">
                    {getActivityTickerImage(item)}
                    <div>{getActivityTickerEvent(item)}</div>
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

export default ActivityTab
