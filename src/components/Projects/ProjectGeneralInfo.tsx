import useFormatMessage from '../../hooks/useFormatMessage.ts'
import useIsProjectEditor from '../../hooks/useIsProjectEditor.ts'
import { Project } from '../../types/proposals.ts'
import Markdown from '../Common/Typography/Markdown.tsx'

import ActionableLinksView from './ActionableLinksView.tsx'
import ActionablePersonnelView from './ActionablePersonnelView.tsx'
import './ProjectSidebar.css'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle.tsx'

interface Props {
  project: Project
}

function ProjectGeneralInfo({ project }: Props) {
  const isEditor = useIsProjectEditor(project)
  const { about, personnel, links } = project
  const t = useFormatMessage()

  return (
    <>
      {about && (
        <div>
          <ProjectSidebarSectionTitle text={t('project_sheet.general_info.about')} />
          <Markdown>{about}</Markdown>
        </div>
      )}
      <ActionableLinksView links={links} projectId={project.id} isEditor={isEditor} />
      <ActionablePersonnelView members={personnel} projectId={project.id} isEditor={isEditor} />
    </>
  )
}

export default ProjectGeneralInfo
