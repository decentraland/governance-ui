import { useBlocker } from 'react-router-dom'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import ConfirmationModal from '../Modal/ConfirmationModal.tsx'

type Props = { preventNavigation: boolean | undefined }

export default function PreventNavigation({ preventNavigation }: Props) {
  const t = useFormatMessage()

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => !!preventNavigation && currentLocation.pathname !== nextLocation.pathname
  )

  return blocker.state === 'blocked' ? (
    <div>
      <ConfirmationModal
        isOpen={true}
        title={t('navigation.prevent_navigation.title')}
        description={t('navigation.prevent_navigation.description')}
        isLoading={false}
        onPrimaryClick={() => blocker.proceed()}
        onSecondaryClick={() => blocker.reset()}
        onClose={() => blocker.reset()}
        primaryButtonText={t('navigation.prevent_navigation.confirm')}
        secondaryButtonText={t('navigation.prevent_navigation.cancel')}
      />
    </div>
  ) : null
}
