import classNames from 'classnames'

import useFormatMessage from '../../../hooks/useFormatMessage'
import QuestionCircleIcon from '../../Icon/QuestionCircle'

import './ProjectUpdateCard.css'

const EmptyProjectUpdate = () => {
  const t = useFormatMessage()

  return (
    <div className={classNames('ProjectUpdateCard', 'ProjectUpdateCard--pending')}>
      <div className="ProjectUpdateCard__Left">
        <div className="ProjectUpdateCard__IconContainer">
          <QuestionCircleIcon size="16" className="EmptyProjectUpdateCard__Icon" />
        </div>
        <div className="ProjectUpdateCard__Description">
          <span>{t('page.grants.empty_update')}</span>
        </div>
      </div>
    </div>
  )
}

export default EmptyProjectUpdate
