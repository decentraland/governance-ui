import useEvents from '../../hooks/useEvents'
import { Project } from '../../types/projects.ts'
import ActivityTickerList from '../Home/ActivityTickerList'

interface Props {
  project: Project
}

function ActivityTab({ project }: Props) {
  const { events, isLoading } = useEvents({ proposal_id: project.proposal_id, with_interval: false })
  return <ActivityTickerList isLoading={isLoading} events={events} />
}

export default ActivityTab
