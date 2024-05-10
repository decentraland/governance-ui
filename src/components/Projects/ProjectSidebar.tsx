import { useEffect, useRef, useState } from 'react'

import useProject from '../../hooks/useProject.ts'
import BoxTabs from '../Common/BoxTabs'
import GovernanceSidebar from '../Sidebar/GovernanceSidebar'

import ProjectHero from './ProjectHero.tsx'
import './ProjectSidebar.css'

interface Props {
  projectId: string
  isSidebarVisible: boolean
  onClose: () => void
}

function ProjectSidebar({ projectId, isSidebarVisible, onClose }: Props) {
  const { project, isLoadingProject } = useProject(projectId)
  const heroSectionRef = useRef<HTMLDivElement | null>(null)
  const [isFloatingHeaderVisible, setIsFloatingHeaderVisible] = useState<boolean>(true) //TODO: floating header

  useEffect(() => {
    console.log('isFloatingHeaderVisible', isFloatingHeaderVisible)
    setIsFloatingHeaderVisible(false)
    if (!isLoadingProject && typeof window !== 'undefined') {
      const handleScroll = () => {
        if (!!heroSectionRef.current && !!window) {
          const { top: heroSectionTop, height: heroSectionHeight } = heroSectionRef.current.getBoundingClientRect()
          setIsFloatingHeaderVisible(heroSectionTop + heroSectionHeight / 2 < 0)
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isLoadingProject])

  return (
    <GovernanceSidebar
      className="ProjectSidebar"
      title={project?.title}
      visible={isSidebarVisible}
      onClose={onClose}
      isLoading={isLoadingProject}
      showTitle={false}
    >
      {project && <ProjectHero project={project} ref={heroSectionRef} />}

      <BoxTabs>
        <BoxTabs.Left>
          <BoxTabs.Tab active={true}>General Info</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Milestones</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Reports</BoxTabs.Tab>
          <BoxTabs.Tab active={false}>Activity</BoxTabs.Tab>
        </BoxTabs.Left>
      </BoxTabs>
      <div className="ProjectSidebar__ContentContainer">
        {/*{hasUpdates && (*/}
        {/*  <ProposalUpdate expanded={false} index={updates.length} update={updates[0]} proposal={proposal} showHealth />*/}
        {/*)}*/}
      </div>
    </GovernanceSidebar>
  )
}

export default ProjectSidebar
