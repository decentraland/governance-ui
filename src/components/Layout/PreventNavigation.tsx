import { useBlocker } from 'react-router-dom'

import ConfirmationModal from '../Modal/ConfirmationModal.tsx'

type Props = { preventNavigation: boolean | undefined }

export default function PreventNavigation({ preventNavigation }: Props) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => !!preventNavigation && currentLocation.pathname !== nextLocation.pathname
  )

  return blocker.state === 'blocked' ? (
    <div>
      <ConfirmationModal
        isOpen={true}
        title={'Are you sure you want to leave? '}
        description={'You will lose the changes you have made.'}
        isLoading={false}
        onPrimaryClick={() => blocker.proceed()}
        onSecondaryClick={() => blocker.reset()}
        onClose={() => blocker.reset()}
        primaryButtonText={'Yes, leave'}
        secondaryButtonText={'Cancel'}
      />
    </div>
  ) : null
}
