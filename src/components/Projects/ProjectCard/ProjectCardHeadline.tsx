import classNames from 'classnames'
import { Header } from 'decentraland-ui/dist/components/Header/Header'

import { ProjectInList } from '../../../types/projects.ts'
import Username from '../../Common/Username'

import './ProjectCardHeadline.css'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  project: ProjectInList
  hoverable?: boolean
  expanded?: boolean
}

const ProjectCardHeadline = ({ project, hoverable = false, expanded = false }: Props) => {
  const { title, author } = project

  return (
    <div className={classNames('ProjectCardHeadline', !expanded && 'ProjectCardHeadline__Slim')}>
      <Header
        className={classNames(
          'ProjectCardHeadline__Title',
          (!hoverable || !expanded) && 'ProjectCardHeadline__TwoLineEllipsis'
        )}
      >
        {title}
      </Header>
      <Username className="ProjectCardHeadline__Avatar" address={author} variant="avatar" size="md" />
    </div>
  )
}

export default ProjectCardHeadline
