import { useEffect, useRef, useState } from 'react'

import { NotMobile } from 'decentraland-ui/dist/components/Media/Media'

import WiderContainer from '../components/Common/WiderContainer'
import FloatingHeader from '../components/FloatingHeader/FloatingHeader.tsx'
import Head from '../components/Layout/Head'
import LoadingView from '../components/Layout/LoadingView'
import Navigation, { NavigationTab } from '../components/Layout/Navigation'
import NotFound from '../components/Layout/NotFound'
import ProjectView from '../components/Projects/ProjectView'
import ProjectViewStatusPill from '../components/Projects/ProjectViewStatusPill.tsx'
import useProject from '../hooks/useProject'
import useURLSearchParams from '../hooks/useURLSearchParams'
import locations from '../utils/locations'

export default function ProjectPage() {
  const params = useURLSearchParams()
  const { project, isLoadingProject } = useProject(params.get('id'))
  const [isFloatingHeaderVisible, setIsFloatingHeaderVisible] = useState<boolean>(true)
  const heroSectionRef = useRef<HTMLDivElement | null>(null)

  const title = project?.title || ''
  const description = project?.about || ''

  useEffect(() => {
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

  if (isLoadingProject) {
    return (
      <>
        <Head title={title} description={description} />
        <Navigation activeTab={NavigationTab.Projects} />
        <LoadingView withNavigation />
      </>
    )
  }

  if (!isLoadingProject && !project) {
    return (
      <WiderContainer>
        <NotFound />
      </WiderContainer>
    )
  }

  return (
    <>
      <Head
        title={title}
        description={description}
        links={[{ rel: 'canonical', href: locations.project({ id: project?.id }) }]}
      />
      <Navigation activeTab={NavigationTab.Projects} />
      <NotMobile>
        {project && (
          <FloatingHeader isVisible={isFloatingHeaderVisible} title={project.title}>
            <ProjectViewStatusPill project={project} />
          </FloatingHeader>
        )}
      </NotMobile>
      <WiderContainer>
        <ProjectView project={project} ref={heroSectionRef} />
      </WiderContainer>
    </>
  )
}
