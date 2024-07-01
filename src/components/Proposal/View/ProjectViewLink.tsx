import classNames from 'classnames'
import { Button } from 'decentraland-ui/dist/components/Button/Button'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProjectStatus } from '../../../types/grants.ts'
import Link from '../../Common/Typography/Link.tsx'
import Markdown from '../../Common/Typography/Markdown'

import './DetailsSection.css'
import './ProjectViewLink.css'
import SidebarHeaderLabel from './SidebarHeaderLabel.tsx'

interface Props {
  projectStatus: ProjectStatus
  isGrantee: boolean
  projectUrl: string
}

function ProjectViewLink({ projectStatus, isGrantee, projectUrl }: Props) {
  const t = useFormatMessage()

  return (
    <div className={classNames(['DetailsSection', `ProjectViewLink--${projectStatus}`])}>
      <div className="DetailsSection__Content">
        <SidebarHeaderLabel className={`ProjectViewLink__Title--${projectStatus}`}>
          {t(
            `page.proposal_detail.project_link.${projectStatus}${
              projectStatus === ProjectStatus.Pending && isGrantee ? '.grantee' : ''
            }.title`
          )}
        </SidebarHeaderLabel>
        <Markdown
          className={classNames(['ProjectViewLink__Description'])}
          componentsClassNames={{
            strong: classNames([
              'ProjectViewLink__Description__StrongText',
              `ProjectViewLink__Description--${projectStatus}`,
            ]),
            p: `ProjectViewLink__Description--${projectStatus}`,
          }}
        >
          {t(
            `page.proposal_detail.project_link.${projectStatus}${
              projectStatus === ProjectStatus.Pending && isGrantee ? '.grantee' : ''
            }.description`
          )}
        </Markdown>
        <Link href={projectUrl}>
          <Button
            primary
            size="small"
            className={classNames(['ProjectViewLink__Action', `ProjectViewLink__Action--${projectStatus}`])}
          >
            {t('page.proposal_detail.project_link.action')}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ProjectViewLink
