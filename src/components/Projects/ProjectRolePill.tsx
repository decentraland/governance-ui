import Pill, { PillColor, PillStyle } from '../Common/Pill'

export enum RoleInProject {
  Coauthor = 'co-author',
  Author = 'author',
  Member = 'member',
}

interface Props {
  role: RoleInProject
}

export default function ProjectRolePill({ role }: Props) {
  return (
    <Pill size="sm" color={PillColor.Gray} style={PillStyle.Outline}>
      {role}
    </Pill>
  )
}
