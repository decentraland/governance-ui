import { useMemo } from 'react'

import { Card } from 'decentraland-ui/dist/components/Card/Card'

import useProposals from '../../hooks/useProposals'
import { NewGrantCategory } from '../../types/grants'
import { ProposalAttributes, ProposalStatus, ProposalType } from '../../types/proposals'
import { formatBalance } from '../../utils/proposal'
import Heading from '../Common/Typography/Heading'
import Text from '../Common/Typography/Text'
import { DetailItem } from '../Proposal/View/DetailItem'

import './GrantList.css'
import ItemsList from './ItemsList'

type Props = {
  status: ProposalStatus
  title: string
}

const GRANT_CATEGORIES = Object.values(NewGrantCategory)

export default function GrantList({ status, title }: Props) {
  const { proposals: grants } = useProposals({
    type: ProposalType.Grant,
    status,
  })

  const data = useMemo(
    () =>
      grants?.data.reduce((acc, item) => {
        const category = item.configuration.category as NewGrantCategory
        if (GRANT_CATEGORIES.includes(category)) {
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(item)
        }
        return acc
      }, {} as Record<NewGrantCategory, ProposalAttributes[]>),
    [grants?.data]
  )

  if (!grants || !data) {
    return null
  }

  return (
    <Card.Content className="GrantList__Content">
      <Heading size="md" weight="semi-bold" className="GrantList__Total">
        {grants.total}
      </Heading>
      <Text size="sm" className="GrantList__Title">
        {title}
      </Text>
      <ItemsList>
        {GRANT_CATEGORIES.map((category) => {
          const grantsPerCategory = data[category]
          const funding = grantsPerCategory.reduce((acc, item) => item.configuration.size + acc, 0)

          return <DetailItem key={category} name={category} value={`$${formatBalance(funding)}`} />
        })}
      </ItemsList>
    </Card.Content>
  )
}
