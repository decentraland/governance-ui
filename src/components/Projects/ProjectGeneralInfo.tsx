import useIsProjectEditor from '../../hooks/useIsProjectEditor.ts'
import useFormatMessage from '../../hooks/useFormatMessage.ts'
import { Project } from '../../types/proposals.ts'
import Text from '../Common/Typography/Text.tsx'

import ActionablePersonnelView from './ActionablePersonnelView.tsx'
import './ProjectSidebar.css'
import ProjectSidebarSectionTitle from './ProjectSidebarSectionTitle.tsx'

interface Props {
  project: Project
}

function ProjectGeneralInfo({ project }: Props) {
  const isEditor = useIsProjectEditor(project)
  const { about, personnel } = project
  const t = useFormatMessage()

  return (
    <>
      {about && (
        <div>
          <ProjectSidebarSectionTitle text={t('project_sheet.general_info.about')} />
          <Text color="secondary">{about}</Text>
        </div>
      )}
      <ActionablePersonnelView members={personnel} isEditor={isEditor} />
    </>
  )
}

export default ProjectGeneralInfo
