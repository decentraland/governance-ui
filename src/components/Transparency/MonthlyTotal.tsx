import { useState } from 'react'

import classNames from 'classnames'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Card } from 'decentraland-ui/dist/components/Card/Card'
import { Header } from 'decentraland-ui/dist/components/Header/Header'

import { MonthlyTotal as MonthlyTotalType } from '../../clients/Transparency'
import useFormatMessage from '../../hooks/useFormatMessage'
import { formatBalance } from '../../utils/proposal'
import { DetailItem } from '../Proposal/View/DetailItem'

import ItemsList from './ItemsList'
import './MonthlyTotal.css'

enum Color {
  RED = 'Number--Red',
  GREEN = 'Number--Green',
}

enum DetailsVisibility {
  OVERVIEW = 'MonthlyTotal--Overview',
  FULL = 'MonthlyTotal--Full',
}

const MAX_TAGS = 5

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  monthlyTotal: MonthlyTotalType
  invertDiffColors?: boolean
}

export default function MonthlyTotal({ title, monthlyTotal, invertDiffColors = false }: Props) {
  const t = useFormatMessage()
  const [belowZeroColor, zeroOrOverColor] = invertDiffColors ? [Color.GREEN, Color.RED] : [Color.RED, Color.GREEN]
  const [detailsVisibility, setDetailsVisibility] = useState(DetailsVisibility.OVERVIEW)

  const handleButtonClick = () => {
    setDetailsVisibility((current) =>
      current === DetailsVisibility.OVERVIEW ? DetailsVisibility.FULL : DetailsVisibility.OVERVIEW
    )
  }

  const allDetails = monthlyTotal.details ?? []

  const bigDetails = allDetails.filter((detail) => Number(detail.value) > 1)
  const smallDetails = allDetails.filter((detail) => Number(detail.value) <= 1)
  const visibleDetails =
    detailsVisibility === DetailsVisibility.OVERVIEW ? bigDetails.slice(0, MAX_TAGS) : [...bigDetails, ...smallDetails]
  const hiddenBigCount = Math.max(bigDetails.length - MAX_TAGS, 0)
  const hiddenSmallCount = smallDetails.length
  const hiddenCount = hiddenBigCount + hiddenSmallCount

  return (
    <div className={classNames('MonthlyTotal', detailsVisibility)}>
      <Card className="MonthlyTotal__Card">
        <Card.Content className="MonthlyTotal_Headers">
          <div>
            <Header className="MonthlyTotal__Header">{title}</Header>
            <Header size="huge" className="MonthlyTotal__Header">
              ${formatBalance(monthlyTotal.total)}
              <Header size="small">USD</Header>
            </Header>
            <Header sub className="MonthlyTotal__Sub">
              <strong
                className={classNames(
                  'Number',
                  monthlyTotal.previous < 0 && belowZeroColor,
                  monthlyTotal.previous >= 0 && zeroOrOverColor
                )}
              >
                {formatBalance(monthlyTotal.previous) + '% '}
              </strong>
              {t('page.transparency.mission.diff_label')}
            </Header>
          </div>
        </Card.Content>

        <Card.Content className={classNames('MonthlyTotal__Detail', detailsVisibility)}>
          <ItemsList>
            {visibleDetails.map((detail, index) => {
              const numericValue = Number(detail.value)
              const isSmall = numericValue <= 1

              return (
                <DetailItem
                  key={['incomeDetail', index].join('::')}
                  name={detail.name}
                  value={'$' + formatBalance(detail.value)}
                  description={detail.description}
                  className={isSmall ? 'MonthlyTotal__Detail--Small' : ''}
                />
              )
            })}
          </ItemsList>
        </Card.Content>

        {hiddenCount > 0 && (
          <Button basic onClick={handleButtonClick}>
            {detailsVisibility === DetailsVisibility.OVERVIEW
              ? t('page.transparency.funding.view_more', { count: hiddenCount })
              : t('modal.vp_delegation.details.show_less')}
          </Button>
        )}
      </Card>
    </div>
  )
}
