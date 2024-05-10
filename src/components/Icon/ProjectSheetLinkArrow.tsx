import classNames from 'classnames'

interface Props {
  className?: string
}

function ProjectSheetLinkArrow({ className }: Props) {
  return (
    <svg
      className={classNames('ProjectSheetLinkArrow', className)}
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect opacity="0.1" width="14" height="12" rx="3" fill="black" />
      <path d="M9 6L6 9L6 3L9 6Z" fill="white" />
    </svg>
  )
}

export default ProjectSheetLinkArrow
