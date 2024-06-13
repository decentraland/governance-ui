import useFormatMessage from '../../../hooks/useFormatMessage'
import Banner from '../../Banner/Banner'

import './PostUpdateBanner.css'

interface Props {
  updateNumber: number
  dueDays: number
  onClick: () => void
  isMandatory?: boolean
}

function PostUpdateBanner({ updateNumber, dueDays, onClick, isMandatory = false }: Props) {
  const t = useFormatMessage()
  return (
    <Banner
      className="PostUpdateBanner"
      isVisible
      title={
        isMandatory
          ? t('page.project_sidebar.updates.banner.title', { number: updateNumber, days: dueDays })
          : t('page.project_sidebar.updates.banner.non_mandatory_title')
      }
      description={t(
        `page.project_sidebar.updates.banner.${isMandatory ? 'description' : 'non_mandatory_description'}`
      )}
      buttonLabel={t('page.project_sidebar.updates.banner.button')}
      bannerHideKey=""
      isClosable={false}
      color={isMandatory ? 'orange' : 'blue'}
      onButtonClick={onClick}
    />
  )
}

export default PostUpdateBanner
