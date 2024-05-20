import Text from '../Common/Typography/Text.tsx'

interface Props {
  text: string
}

function ProjectSidebarTitle({ text }: Props) {
  return (
    <>
      <Text size="sm" color="default" weight="semi-bold" uppercase>
        {text}
      </Text>
    </>
  )
}

export default ProjectSidebarTitle
