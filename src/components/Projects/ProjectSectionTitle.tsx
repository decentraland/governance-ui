import Text from '../Common/Typography/Text.tsx'

interface Props {
  text: string
}

function ProjectSectionTitle({ text }: Props) {
  return (
    <Text size="sm" color="default" weight="semi-bold" transform="uppercase">
      {text}
    </Text>
  )
}

export default ProjectSectionTitle
