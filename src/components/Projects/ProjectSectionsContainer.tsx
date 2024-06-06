import './ProjectSectionsContainer.css'

interface Props {
  children: React.ReactNode
}

export default function ProjectSectionsContainer({ children }: Props) {
  return <div className="ProjectSectionsContainer">{children}</div>
}
