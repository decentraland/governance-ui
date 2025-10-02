import { useMemo } from 'react'

import { Card } from 'decentraland-ui/dist/components/Card/Card'

import Heading from '../components/Common/Typography/Heading'
import WiderContainer from '../components/Common/WiderContainer'
import ChartBar from '../components/Icon/ChartBar'
import Database from '../components/Icon/Database'
import Discord from '../components/Icon/Discord'
import Document from '../components/Icon/Document'
import DocumentOutline from '../components/Icon/DocumentOutline'
import Person from '../components/Icon/Person'
import Head from '../components/Layout/Head'
import LoadingView from '../components/Layout/LoadingView'
import Navigation, { NavigationTab } from '../components/Layout/Navigation'
import TokenBalanceCard from '../components/Token/TokenBalanceCard'
import DaoVestingCard from '../components/Transparency/DaoVestingCard'
import MonthlyTotal from '../components/Transparency/MonthlyTotal'
import Sidebar from '../components/Transparency/Sidebar'
import { DOCS_URL, JOIN_DISCORD_URL, OPEN_CALL_FOR_DELEGATES_LINK } from '../constants'
import useFormatMessage from '../hooks/useFormatMessage'
import useTransparency from '../hooks/useTransparency'
import locations from '../utils/locations'
import { aggregateBalances } from '../utils/transparency'

import './transparency.css'

const DASHBOARD_URL =
  'https://datastudio.google.com/u/3/reporting/fca13118-c18d-4e68-9582-ad46d2dd5ce9/page/p_n06szvxkrc'
const DATA_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1FoV7TdMTVnqVOZoV4bvVdHWkeu4sMH5JEhp8L0Shjlo/edit'
const ABOUT_DAO_URL = 'https://docs.decentraland.org/decentraland/how-does-the-dao-work/'
const WEARABLE_CURATORS_URL = 'https://forum.decentraland.org/t/wearables-curation-committee-member-nominations/2047'

export default function TransparencyPage() {
  const t = useFormatMessage()
  const { data } = useTransparency()
  const balances = useMemo(() => (data && aggregateBalances(data.balances)) || [], [data])

  return (
    <>
      <Navigation activeTab={NavigationTab.Transparency} />
      <Head
        title={t('page.transparency.title')}
        description={t('page.transparency.mission.description')}
        links={[{ rel: 'canonical', href: locations.transparency() }]}
      />
      <div className="TransparencyPage">
        {!data && <LoadingView withNavigation />}
        {data && (
          <WiderContainer>
            <div className="TransparencyGrid">
              <Sidebar
                title={t('page.transparency.mission.title')}
                description={t('page.transparency.mission.description')}
                buttons={[
                  {
                    href: JOIN_DISCORD_URL,
                    icon: <Discord color="var(--black-800)" size={20} />,
                    children: t('page.transparency.mission.join_discord_button'),
                  },
                  {
                    href: DOCS_URL,
                    icon: <Document size={20} />,
                    children: t('page.transparency.mission.docs_button'),
                  },
                  {
                    href: DASHBOARD_URL,
                    icon: <ChartBar size={20} />,
                    children: t('page.transparency.mission.dashboard_button'),
                  },
                  {
                    href: DATA_SHEET_URL,
                    icon: <Database size={20} />,
                    children: t('page.transparency.mission.data_source_button'),
                  },
                ]}
              />
              <div>
                <DaoVestingCard />
                <div className="Transparency__Section Transparency__BalanceCard">
                  <Card className="Transparency__Card">
                    <Card.Content>
                      <Heading size="sm" weight="semi-bold">
                        {t('page.transparency.mission.balance_title')}
                      </Heading>
                      <div className="Transparecy__TokenContainer">
                        {balances &&
                          balances.map((tokenBalance, index) => {
                            return (
                              <TokenBalanceCard
                                aggregatedTokenBalance={tokenBalance}
                                key={['tokenBalance', index].join('::')}
                              />
                            )
                          })}
                      </div>
                    </Card.Content>
                  </Card>
                </div>
                <div className="Transparency__MonthlyTotals">
                  <MonthlyTotal
                    title={t('page.transparency.mission.monthly_income') || ''}
                    monthlyTotal={data.income}
                  />
                  <MonthlyTotal
                    title={t('page.transparency.mission.monthly_expenses') || ''}
                    monthlyTotal={data.expenses}
                    invertDiffColors={true}
                  />
                </div>
              </div>
            </div>

            <div className="TransparencyGrid">
              <Sidebar
                title={t('page.transparency.members.title')}
                description={t('page.transparency.members.description')}
                buttons={[
                  {
                    href: ABOUT_DAO_URL,
                    icon: <DocumentOutline size={20} />,
                    children: t('page.transparency.members.about_dao_button'),
                  },
                  {
                    href: WEARABLE_CURATORS_URL,
                    icon: <Person size={20} />,
                    children: t('page.transparency.members.wearables_curator_button'),
                  },
                  {
                    href: OPEN_CALL_FOR_DELEGATES_LINK,
                    icon: <Person size={20} />,
                    children: t('page.transparency.members.delegate_button'),
                  },
                ]}
              />
            </div>
          </WiderContainer>
        )}
      </div>
    </>
  )
}
