import { Project } from '../../types/proposals.ts'

import EditablePersonnelView from './EditablePersonnelView.tsx'
import './ProjectSidebar.css'

interface Props {
  project: Project
}

function ProjectGeneralInfo({ project }: Props) {
  return (
    <div className="ProjectSidebar__ContentContainer">
      <EditablePersonnelView members={project.personnel} />
    </div>
  )
}

export default ProjectGeneralInfo
