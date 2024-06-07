import useFormatMessage from '../../hooks/useFormatMessage'
import Trashcan from '../Icon/Trashcan'

export default function DeleteActionLabel() {
  const t = useFormatMessage()

  return (
    <div className="ActionableBreakdownContent__Button">
      <Trashcan />
      {t('component.expandable_breakdown_item.delete_action_label')}
    </div>
  )
}
