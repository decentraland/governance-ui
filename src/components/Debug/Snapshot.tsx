import { useState } from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Field } from 'decentraland-ui/dist/components/Field/Field'

import { Governance } from '../../clients/Governance'
import { SNAPSHOT_SPACE } from '../../constants/snapshot'
import Heading from '../Common/Typography/Heading'
import Label from '../Common/Typography/Label'
import Text from '../Common/Typography/Text'
import ErrorMessage from '../Error/ErrorMessage'
import { ContentSection } from '../Layout/ContentLayout'

interface Props {
  className?: string
}

export default function Snapshot({ className }: Props) {
  const [spaceName, setSpaceName] = useState(SNAPSHOT_SPACE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [snapshotConfig, setSnapshotConfig] = useState<any>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [snapshotSpace, setSnapshotSpace] = useState<any>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errorMessage, setErrorMessage] = useState<any>()

  async function handleFetchClick() {
    setErrorMessage('')
    try {
      const { config: newConfig, space: newSpace } = await Governance.get().getSnapshotConfigAndSpace(spaceName)
      setSnapshotConfig(newConfig)
      setSnapshotSpace(newSpace)
      setErrorMessage('')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setErrorMessage(e.message)
    }
  }

  return (
    <div className={className}>
      <Heading size="sm">{'Snapshot'}</Heading>
      <ContentSection>
        <Label>{'Space Name'}</Label>
        <div className="SpaceName__Section">
          <Field value={spaceName} onChange={(_, { value }) => setSpaceName(value)} />
          <Button className="Debug__SideButton" primary disabled={!spaceName} onClick={() => handleFetchClick()}>
            {'Fetch Status & Space'}
          </Button>
        </div>
      </ContentSection>
      <Label>{'Config'}</Label>
      <Text>{JSON.stringify(snapshotConfig)}</Text>
      <Label>{'Space'}</Label>
      <Text>{JSON.stringify(snapshotSpace)}</Text>
      {!!errorMessage && <ErrorMessage label={'Snapshot Error'} errorMessage={errorMessage} />}
    </div>
  )
}
