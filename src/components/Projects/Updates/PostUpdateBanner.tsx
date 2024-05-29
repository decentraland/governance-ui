import useFormatMessage from '../../../hooks/useFormatMessage'
import Banner from '../../Banner/Banner'

import './PostUpdateBanner.css'

interface Props {
  updateNumber: number
  dueDays: number
  onClick: () => void
}

function PostUpdateBanner({ updateNumber, dueDays, onClick }: Props) {
  const t = useFormatMessage()

  return (
    <Banner
      className="PostUpdateBanner"
      isVisible
      title={t('page.project_sidebar.updates.banner.title', { number: updateNumber, days: dueDays })}
      description={t('page.project_sidebar.updates.banner.description')}
      buttonLabel={t('page.project_sidebar.updates.banner.button')}
      bannerHideKey=""
      isClosable={false}
      color="red"
      onButtonClick={onClick}
    />
  )
}

export default PostUpdateBanner
