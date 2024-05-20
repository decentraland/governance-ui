import { useCallback } from 'react'

import useFormatMessage from '../../../hooks/useFormatMessage'
import { UpdateAttributes, UpdateStatus } from '../../../types/updates'
import locations from '../../../utils/locations'
import Banner from '../../Banner/Banner'

interface Props {
  updateNumber: number
  dueDays: number
  currentUpdate?: UpdateAttributes | null
  proposalId: string
}

function PostUpdateBanner({ updateNumber, dueDays, currentUpdate, proposalId }: Props) {
  const t = useFormatMessage()

  const navigateToNextUpdateSubmit = useCallback(() => {
    const hasUpcomingPendingUpdate = currentUpdate?.id && currentUpdate?.status === UpdateStatus.Pending
    return locations.submitUpdate({
      ...(hasUpcomingPendingUpdate && { id: currentUpdate?.id }),
      proposalId,
    })
  }, [currentUpdate?.id, currentUpdate?.status, proposalId])

  return (
    <Banner
      isVisible
      title={t('page.project_sidebar.updates.banner.title', { number: updateNumber, days: dueDays })}
      description={t('page.project_sidebar.updates.banner.description')}
      buttonLabel={t('page.project_sidebar.updates.banner.button')}
      bannerHideKey=""
      isClosable={false}
      color="red"
      buttonHref={navigateToNextUpdateSubmit()}
    />
  )
}

export default PostUpdateBanner
