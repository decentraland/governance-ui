import { Project } from '../../types/proposals.ts'
import PersonnelView from '../GrantRequest/PersonnelView.tsx'

import './ProjectSidebar.css'

interface Props {
  project: Project
}

function ProjectGeneralInfo({ project }: Props) {
  return (
    <div className="ProjectSidebar__ContentContainer">
      <PersonnelView members={project.personnel} />
    </div>
  )
}

export default ProjectGeneralInfo
