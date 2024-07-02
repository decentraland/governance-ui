import { getEnumDisplayName } from '../../helpers'
import useFormatMessage from '../../hooks/useFormatMessage'
import { ActivityTickerEvent, EventType, ProposalCommentedEventData } from '../../types/events'
import Time from '../../utils/date/Time'
import Link from '../Common/Typography/Link'
import Markdown from '../Common/Typography/Markdown'
import Text from '../Common/Typography/Text'

import { getLink } from './utils'

function getTextValues(event: ActivityTickerEvent) {
  const { event_type, event_data } = event
  switch (event_type) {
    case EventType.ProposalFinished:
      return {
        title: event_data.proposal_title,
        result: getEnumDisplayName(event_data.new_status),
      }
    default:
      return {
        title: (event_data as ProposalCommentedEventData).proposal_title,
        author: event.author || (event_data as ProposalCommentedEventData).discourse_post.username,
      }
  }
}

export default function ProposalRelatedEvent({ event }: { event: ActivityTickerEvent }) {
  const t = useFormatMessage()

  return (
    <Link href={getLink(event)}>
      <Markdown
        className="ActivityTicker__ListItemMarkdown"
        componentsClassNames={{ strong: 'ActivityTicker__ListItemMarkdownTitle' }}
      >
        {t(`page.home.activity_ticker.${event.event_type}`, getTextValues(event))}
      </Markdown>
      <Text className="ActivityTicker__ListItemDate" size="xs">
        {Time(event.created_at).fromNow()}
      </Text>
    </Link>
  )
}
