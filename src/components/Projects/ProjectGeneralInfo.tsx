import { Project } from '../../types/proposals.ts'

import './ProjectSidebar.css'

interface Props {
  project: Project
}

function ProjectGeneralInfo({ project }: Props) {
  return (
    <div className="ProjectSidebar__ContentContainer">
      <h1>Personnel</h1>
      {project && <div>{JSON.stringify(project.personnel[0])}</div>}
      {project && <div>{JSON.stringify(project.personnel[1])}</div>}
      {project && <div>{JSON.stringify(project.personnel[2])}</div>}

      {/*<PersonnelView members={project.personnel} />*/}
    </div>
  )
}

export default ProjectGeneralInfo
