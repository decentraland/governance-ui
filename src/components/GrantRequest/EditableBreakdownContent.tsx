import { Button } from 'decentraland-ui/dist/components/Button/Button'

import Link from '../Common/Typography/Link.tsx'
import Open from '../Icon/Open.tsx'

import './EditableBreakdownContent.css'

interface Props {
  about: string
  relevantLink?: string
  onClick: () => void
}

//TODO: internationalization
function EditableBreakdownContent({ about, relevantLink, onClick }: Props) {
  return (
    <div>
      <div className="EditableBreakdownContent__Text">{about}</div>
      <div className="EditableBreakdownContent__Footer">
        {relevantLink ? (
          <Link className="RelevantLink" href={relevantLink}>
            <div className="RelevantLink__Text">Relevant Link</div>
            <Open size={10} />
          </Link>
        ) : (
          <div></div>
        )}
        <Button basic onClick={onClick}>
          Edit
        </Button>
      </div>
    </div>
  )
}

export default EditableBreakdownContent
