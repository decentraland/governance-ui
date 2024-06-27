import WiderContainer from '../components/Common/WiderContainer'
import Head from '../components/Layout/Head'
import LoadingView from '../components/Layout/LoadingView'
import Navigation, { NavigationTab } from '../components/Layout/Navigation'
import NotFound from '../components/Layout/NotFound'
import ProjectView from '../components/Projects/ProjectView'
import useProject from '../hooks/useProject'
import useURLSearchParams from '../hooks/useURLSearchParams'
import locations from '../utils/locations'

export default function ProjectPage() {
  const params = useURLSearchParams()
  const { project, isLoadingProject } = useProject(params.get('id'))

  const title = project?.title || ''
  const description = project?.about || ''

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
      <WiderContainer>
        <ProjectView project={project} isFullscreen />
      </WiderContainer>
    </>
  )
}
