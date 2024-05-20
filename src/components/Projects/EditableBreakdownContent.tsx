import { Button } from 'decentraland-ui/dist/components/Button/Button'

import useFormatMessage from '../../hooks/useFormatMessage.ts'
import Link from '../Common/Typography/Link.tsx'
import Open from '../Icon/Open.tsx'

import './EditableBreakdownContent.css'

interface Props {
  about: string
  relevantLink?: string
  onClick: () => void
}

function EditableBreakdownContent({ about, relevantLink, onClick }: Props) {
  const t = useFormatMessage()

  return (
    <div>
      <div className="EditableBreakdownContent__Text">{about}</div>
      <div className="EditableBreakdownContent__Footer">
        {relevantLink ? (
          <Link className="RelevantLink" href={relevantLink} target="_blank">
            <div className="RelevantLink__Text">{t('component.expandable_breakdown_item.relevant_link_label')}</div>
            <Open size={10} />
          </Link>
        ) : (
          <div></div>
        )}
        <Button basic onClick={onClick}>
          {t('component.expandable_breakdown_item.edit_action_label')}
        </Button>
      </div>
    </div>
  )
}

export default EditableBreakdownContent
