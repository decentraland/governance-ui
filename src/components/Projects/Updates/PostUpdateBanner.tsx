import useFormatMessage from '../../../hooks/useFormatMessage'
import Banner from '../../Banner/Banner'

interface Props {
  updateNumber: number
  dueDays: number
}

// TODO: add button action to navigate to the update page
function PostUpdateBanner({ updateNumber, dueDays }: Props) {
  const t = useFormatMessage()
  return (
    <Banner
      isVisible
      title={t('page.project_sidebar.updates.banner.title', { number: updateNumber, days: dueDays })}
      description={t('page.project_sidebar.updates.banner.description')}
      buttonLabel={t('page.project_sidebar.updates.banner.button')}
      bannerHideKey=""
      isClosable={false}
      color="red"
    />
  )
}

export default PostUpdateBanner
