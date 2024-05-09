import classNames from 'classnames'
import { Button } from 'decentraland-ui/dist/components/Button/Button'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { ProjectStatus } from '../../../types/grants.ts'
import { projectUrl } from '../../../utils/proposal.ts'
import Link from '../../Common/Typography/Link'
import Markdown from '../../Common/Typography/Markdown'
import ProjectSheetLinkArrow from '../../Icon/ProjectSheetLinkArrow.tsx'

import './DetailsSection.css'
import './ProjectSheetLink.css'
import SidebarHeaderLabel from './SidebarHeaderLabel.tsx'

interface Props {
  projectId: string
  projectStatus: ProjectStatus
  isGrantee: boolean
}

function ProjectSheetLink({ projectId, projectStatus, isGrantee }: Props) {
  const t = useFormatMessage()

  return (
    <div className={classNames(['DetailsSection', `ProjectSheetLink--${projectStatus}`])}>
      <div className="DetailsSection__Content">
        <SidebarHeaderLabel className={`ProjectSheetLink__Title--${projectStatus}`}>
          {t(
            `page.proposal_detail.project_sheet_link.${projectStatus}${
              projectStatus === ProjectStatus.Pending && isGrantee ? '.grantee' : ''
            }.title`
          )}
        </SidebarHeaderLabel>
        <Markdown
          className={classNames(['ProjectSheetLink__Description'])}
          componentsClassNames={{
            strong: classNames([
              'ProjectSheetLink__Description__StrongText',
              `ProjectSheetLink__Description--${projectStatus}`,
            ]),
            p: `ProjectSheetLink__Description--${projectStatus}`,
          }}
        >
          {t(
            `page.proposal_detail.project_sheet_link.${projectStatus}${
              projectStatus === ProjectStatus.Pending && isGrantee ? '.grantee' : ''
            }.description`
          )}
        </Markdown>
        <Button
          href={projectUrl(projectId)}
          as={Link}
          primary
          size="small"
          className={classNames(['ProjectSheetLink__Action', `ProjectSheetLink__Action--${projectStatus}`])}
        >
          {t('page.proposal_detail.project_sheet_link.action')}
          <ProjectSheetLinkArrow />
        </Button>
      </div>
    </div>
  )
}

export default ProjectSheetLink
