import { useIntl } from 'react-intl'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProjectInList } from '../../../types/proposals'
import Username from '../../Common/Username'
import ProjectPill from '../ProjectPill'

import './ProjectCardHeader.css'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  project: ProjectInList
}

const ProjectCardHeader = ({ project }: Props) => {
  const { configuration, author } = project
  const intl = useIntl()
  const t = useFormatMessage()

  return (
    <div className="ProjectCardHeader">
      <div className="ProjectCardHeader__ConfigurationInfo">
        {configuration.category && <ProjectPill type={configuration.category} />}
        <div className="ProjectCardHeader__SizeContainer">
          <p className="ProjectCardHeader__Size">{`${t('component.grant_card.size')}: $${intl.formatNumber(
            configuration.size
          )} USD`}</p>
        </div>
      </div>
      <div className="ProjectCardHeader__Username">
        {t('component.grant_card.by_user')}
        <Username address={author} variant="address" />
      </div>
    </div>
  )
}

export default ProjectCardHeader
