import { Button } from 'decentraland-ui/dist/components/Button/Button'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import Link from '../Common/Typography/Link.tsx'
import Open from '../Icon/Open.tsx'

import './ActionableBreakdownContent.css'

interface Props {
  about: string
  relevantLink?: string
  actionLabel?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function ActionableBreakdownContent({ about, relevantLink, onClick, actionLabel }: Props) {
  const t = useFormatMessage()

  return (
    <div>
      <div className="ActionableBreakdownContent__Text">{about}</div>
      <div className="ActionableBreakdownContent__Footer">
        {relevantLink ? (
          <Link className="RelevantLink" href={relevantLink} target="_blank">
            <div className="RelevantLink__Text">{t('component.expandable_breakdown_item.relevant_link_label')}</div>
            <Open size={10} />
          </Link>
        ) : (
          <div></div>
        )}
        <Button basic onClick={onClick}>
          {actionLabel}
        </Button>
      </div>
    </div>
  )
}

export default ActionableBreakdownContent
