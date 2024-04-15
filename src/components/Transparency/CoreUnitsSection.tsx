import { GovernanceBadgeSpec } from '../../types/badges'

import CoreUnitCard from './CoreUnitCard'
import './CoreUnitsSection.css'

interface Props {
  coreUnitsBadges: GovernanceBadgeSpec[]
}

function CoreUnitsSection({ coreUnitsBadges }: Props) {
  return (
    <div className="CoreUnitsSection">
      {coreUnitsBadges.map((badgeSpec) => {
        return <CoreUnitCard key={badgeSpec.name} {...badgeSpec} />
      })}
    </div>
  )
}

export default CoreUnitsSection
