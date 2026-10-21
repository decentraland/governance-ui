import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { Mobile, NotMobile, useTabletAndBelowMediaQuery } from 'decentraland-ui/dist/components/Media/Media'
import { Pagination } from 'decentraland-ui/dist/components/Pagination/Pagination'

import RandomBanner from '../components/Banner/RandomBanner'
import CategoryBanner from '../components/Category/CategoryBanner'
import Empty from '../components/Common/Empty'
import ProposalPreviewCard from '../components/Common/ProposalPreviewCard/ProposalPreviewCard'
import Link from '../components/Common/Typography/Link'
import Text from '../components/Common/Typography/Text'
import WiderContainer from '../components/Common/WiderContainer'
import ActionableLayout from '../components/Layout/ActionableLayout'
import Head from '../components/Layout/Head'
import LoadingView from '../components/Layout/LoadingView'
import MaintenanceLayout from '../components/Layout/MaintenanceLayout'
import Navigation, { NavigationTab } from '../components/Layout/Navigation'
import LegislativeTracker from '../components/LegislativeTracker'
import PriorityProposalsBox from '../components/Profile/PriorityProposalsBox'
import ProposalItem from '../components/Proposal/ProposalItem'
import CategoryFilter from '../components/Search/CategoryFilter'
import FilterMenu from '../components/Search/FilterMenu'
import SearchTitle from '../components/Search/SearchTitle'
import SortingMenu from '../components/Search/SortingMenu'
import StatusFilter from '../components/Search/StatusFilter'
import TimeFrameFilter from '../components/Search/TimeFrameFilter'
import { useAuthContext } from '../context/AuthProvider'
import useFormatMessage from '../hooks/useFormatMessage'
import usePriorityProposals from '../hooks/usePriorityProposals'
import useProposals from '../hooks/useProposals'
import useProposalsByCoAuthor from '../hooks/useProposalsByCoAuthor'
import useProposalsCachedVotes from '../hooks/useProposalsCachedVotes'
import { useProposalsSearchParams } from '../hooks/useProposalsSearchParams'
import { CoauthorStatus } from '../types/coauthors'
import { ProposalStatus, ProposalType } from '../types/proposals'
import locations from '../utils/locations'
import { isUnderMaintenance } from '../utils/maintenance'

import './proposals.css'

const ITEMS_PER_PAGE = 25

export default function ProposalsPage() {
  const t = useFormatMessage()
  const location = useLocation()
  const navigate = useNavigate()
  const [user, authState] = useAuthContext()
  const { type, subtype, status, search, searching, timeFrame, order, page, filtering } = useProposalsSearchParams()
  // keep showing the previous results while a new filter loads, so the sidebar stays mounted
  const { proposals, isLoadingProposals, isPreviousData, isError } = useProposals(
    {
      type,
      subtype,
      status,
      page,
      search,
      timeFrame,
      order,
      itemsPerPage: ITEMS_PER_PAGE,
    },
    { keepPreviousData: true }
  )
  const proposalIds = (proposals?.data || []).map((proposal) => proposal.id)
  const { segmentedVotes, isLoadingVotes } = useProposalsCachedVotes(proposalIds)
  const isTabletAndBelow = useTabletAndBelowMediaQuery()

  const handlePageFilter = useCallback(
    (page: number, options?: { replace?: boolean }) => {
      const newParams = new URLSearchParams(location.search)
      page !== 1 ? newParams.set('page', String(page)) : newParams.delete('page')
      return navigate(locations.proposals(newParams), options)
    },
    [location.search, navigate]
  )

  useEffect(() => {
    // skip while the previous filter's results are shown, and when there are no results at all
    // (maxPage 0 would push a ?page=0 entry on every empty search). Replace instead of push, so
    // going back to an out-of-range page doesn't bounce the user forward again
    if (typeof proposals?.total === 'number' && !isPreviousData) {
      const maxPage = Math.ceil(proposals.total / ITEMS_PER_PAGE)
      if (maxPage > 0 && page > maxPage) {
        handlePageFilter(maxPage, { replace: true })
      }
    }
  }, [handlePageFilter, page, proposals, isPreviousData])

  const { requestsStatus } = useProposalsByCoAuthor(user, CoauthorStatus.PENDING)
  const { priorityProposals, isLoading: isLoadingPriorityProposals } = usePriorityProposals(user?.toLowerCase())

  const title =
    (type === ProposalType.Catalyst && t('page.proposal_catalyst_list.title')) ||
    (type === ProposalType.POI && t('page.proposal_poi_list.title')) ||
    (type === ProposalType.BanName && t('page.proposal_ban_name_list.title')) ||
    (type === ProposalType.Poll && t('page.proposal_poll_list.title')) ||
    t('page.proposal_list.title') ||
    ''

  const description =
    (type === ProposalType.Catalyst && t('page.proposal_catalyst_list.description')) ||
    (type === ProposalType.POI && t('page.proposal_poi_list.description')) ||
    (type === ProposalType.BanName && t('page.proposal_ban_name_list.description')) ||
    (type === ProposalType.Poll && t('page.proposal_poll_list.description')) ||
    t('page.proposal_list.description') ||
    ''

  if (isUnderMaintenance()) {
    return <MaintenanceLayout title={title} description={description} activeTab={NavigationTab.Proposals} />
  }

  // the full-page loader is only for the first load; later filter changes only reload the list
  const isLoadingPage = (!proposals && !isError) || authState.loading
  const isLoading = isLoadingProposals || isPreviousData || isLoadingVotes

  return (
    <>
      <Head title={title} description={description} links={[{ rel: 'canonical', href: locations.proposals() }]} />
      <Navigation activeTab={NavigationTab.Proposals} />
      <WiderContainer>
        {isLoadingPage && <LoadingView />}
        {!isLoadingPage && (
          <>
            {search && (
              <NotMobile>
                <SearchTitle />
              </NotMobile>
            )}
            <RandomBanner isVisible={!searching} />
            <div className="ProposalsPage__Container">
              <div className="ProposalsPage__Sidebar">
                <NotMobile>
                  <div>
                    <CategoryFilter filterType={ProposalType} />
                    <StatusFilter statusType={ProposalStatus} />
                    <TimeFrameFilter />
                    <LegislativeTracker />
                  </div>
                </NotMobile>
              </div>
              <div className="ProposalsPage__Content">
                {searching && (
                  <Mobile>
                    <SearchTitle />
                  </Mobile>
                )}

                {!filtering && (
                  <PriorityProposalsBox
                    priorityProposals={priorityProposals}
                    isLoading={isLoadingPriorityProposals}
                    collapsible
                  />
                )}
                <ActionableLayout
                  leftAction={
                    <Text color="secondary" weight="semi-bold" className="ProposalsPage__ProposalCount">
                      {t('general.count_proposals', { count: proposals?.total || 0 })}
                    </Text>
                  }
                  rightAction={
                    <>
                      <SortingMenu />
                      <Mobile>
                        <FilterMenu>
                          <CategoryFilter filterType={ProposalType} />
                          <StatusFilter statusType={ProposalStatus} />
                          <TimeFrameFilter />
                        </FilterMenu>
                      </Mobile>
                      <Button
                        primary
                        size="small"
                        className="ProposalsPage__SubmitButton"
                        as={Link}
                        href={locations.submit()}
                      >
                        {t('page.proposal_list.new_proposal')}
                      </Button>
                    </>
                  }
                >
                  {isLoading && (
                    <div className="ProposalsPage__LoaderContainer">
                      <Loader size="medium" active={isLoading} />
                    </div>
                  )}
                  {!isLoading && (
                    <>
                      {type && !searching && <CategoryBanner type={type} />}
                      {!proposals && isError && (
                        <Empty className="ProposalsPage__Empty" description={t('page.proposal_list.error_loading')} />
                      )}
                      {proposals && proposals.data.length === 0 && (
                        <Empty
                          className="ProposalsPage__Empty"
                          description={
                            searching || status || timeFrame?.length > 0
                              ? t('navigation.search.no_matches')
                              : t('page.proposal_list.no_proposals_yet')
                          }
                        />
                      )}
                      {proposals && (
                        <div className="ProposalsPage__List">
                          {proposals.data.map((proposal) => {
                            return isTabletAndBelow ? (
                              <ProposalItem
                                key={proposal.id}
                                proposal={proposal}
                                hasCoauthorRequest={!!requestsStatus.find((req) => req.proposal_id === proposal.id)}
                                votes={segmentedVotes ? segmentedVotes[proposal.id]?.highQualityVotes : undefined}
                              />
                            ) : (
                              <ProposalPreviewCard
                                key={proposal.id}
                                proposal={proposal}
                                votes={segmentedVotes ? segmentedVotes[proposal.id]?.highQualityVotes : undefined}
                                variant="category"
                              />
                            )
                          })}
                        </div>
                      )}
                      {proposals && proposals.total > ITEMS_PER_PAGE && (
                        <Pagination
                          onPageChange={(_e, { activePage }) => {
                            window.scrollTo({ top: 0 })
                            handlePageFilter(activePage as number)
                          }}
                          totalPages={Math.ceil(proposals.total / ITEMS_PER_PAGE)}
                          activePage={page}
                          firstItem={null}
                          lastItem={null}
                        />
                      )}
                    </>
                  )}
                </ActionableLayout>
              </div>
            </div>
          </>
        )}
      </WiderContainer>
    </>
  )
}
