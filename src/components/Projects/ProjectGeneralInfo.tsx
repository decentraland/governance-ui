import useFormatMessage from '../../hooks/useFormatMessage.ts'
import useIsProjectEditor from '../../hooks/useIsProjectEditor.ts'
import { ProjectStatus } from '../../types/grants.ts'
import { Project } from '../../types/proposals.ts'
import Mobile from '../Common/MediaQuery/Mobile.tsx'
import Markdown from '../Common/Typography/Markdown.tsx'

import ActionableLinksView from './ActionableLinksView.tsx'
import ActionablePersonnelView from './ActionablePersonnelView.tsx'
import ProjectSectionTitle from './ProjectSectionTitle.tsx'
import ProjectStatusCardWrapper from './ProjectStatusCardWrapper.tsx'
import ProjectViewFundingSection from './ProjectViewFundingSection.tsx'

interface Props {
  project: Project
}

function ProjectGeneralInfo({ project }: Props) {
  const { isEditor, isEditable } = useIsProjectEditor(project)
  const { about, personnel, links } = project
  const t = useFormatMessage()

  return (
    <>
      {project.status !== ProjectStatus.Pending && <ProjectStatusCardWrapper project={project} />}
      {project.funding && (
        <Mobile>
          <ProjectViewFundingSection project={project} />
        </Mobile>
      )}
      {about && (
        <div>
          <ProjectSectionTitle text={t('project.general_info.about')} />
          <Markdown>{about}</Markdown>
        </div>
      )}
      <ActionableLinksView
        links={links}
        projectId={project.id}
        proposalId={project.proposal_id}
        canEdit={isEditor && isEditable}
      />
      <ActionablePersonnelView members={personnel} projectId={project.id} canEdit={isEditor && isEditable} />
    </>
  )
}

export default ProjectGeneralInfo
