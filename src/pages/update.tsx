import { Header } from 'decentraland-ui/dist/components/Header/Header'

import Link from '../components/Common/Typography/Link'
import ContentLayout, { ContentSection } from '../components/Layout/ContentLayout'
import Head from '../components/Layout/Head'
import LoadingView from '../components/Layout/LoadingView'
import NotFound from '../components/Layout/NotFound'
import UpdateComments from '../components/Updates/UpdateComments'
import UpdateMarkdownView from '../components/Updates/UpdateMarkdownView'
import useFormatMessage from '../hooks/useFormatMessage'
import useProjectUpdate from '../hooks/useProjectUpdate'
import useProjectUpdates from '../hooks/useProjectUpdates'
import useProposal from '../hooks/useProposal'
import useURLSearchParams from '../hooks/useURLSearchParams'
import Time from '../utils/date/Time'
import locations from '../utils/locations'
import { getLatestUpdate, getUpdateNumber } from '../utils/updates'

import './update.css'

export default function UpdateDetail() {
  const t = useFormatMessage()
  const params = useURLSearchParams()
  const updateId = params.get('id')
  const { update, isLoadingUpdate, isErrorOnUpdate } = useProjectUpdate(updateId)
  const { proposal, isErrorOnProposal, isLoadingProposal } = useProposal(update?.proposal_id)
  const {
    publicUpdates,
    isLoading: isLoadingPublicUpdates,
    isError: isErrorOnPublicUpdates,
  } = useProjectUpdates(update?.project_id)

  if (isErrorOnUpdate || isErrorOnProposal || isErrorOnPublicUpdates) {
    return (
      <ContentLayout>
        <NotFound />
      </ContentLayout>
    )
  }

  if (!update || !publicUpdates || isLoadingUpdate || isLoadingPublicUpdates || isLoadingProposal) {
    return <LoadingView />
  }

  const index = getUpdateNumber(publicUpdates, updateId)
  const proposalHref = locations.proposal(update.proposal_id)

  const previousUpdate = getLatestUpdate(publicUpdates || [], Time(update.completion_date).toDate())

  return (
    <>
      <Head
        title={t('page.update_detail.page_title', { title: proposal?.title, index })}
        description={update?.introduction}
        links={[{ rel: 'canonical', href: locations.update(update.id) }]}
      />
      <ContentLayout navigateBackUrl={proposalHref} small>
        <ContentSection className="UpdateDetail__Header">
          <span className="UpdateDetail__ProjectTitle">
            {t('page.update_detail.project_title', { title: <Link href={proposalHref}>{proposal?.title}</Link> })}
          </span>
          <Header size="huge">{t('page.update_detail.title', { index })}</Header>
        </ContentSection>
        {update && (
          <>
            <UpdateMarkdownView
              update={update}
              author={update.author}
              previousUpdate={previousUpdate}
              proposal={proposal}
            />
            <UpdateComments update={update} />
          </>
        )}
      </ContentLayout>
    </>
  )
}
