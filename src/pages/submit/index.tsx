import { useState } from 'react'

import { Header } from 'decentraland-ui/dist/components/Header/Header'

import CategoryBanner from '../../components/Category/CategoryBanner'
import Text from '../../components/Common/Typography/Text'
import ContentLayout, { ContentSection } from '../../components/Layout/ContentLayout'
import Head from '../../components/Layout/Head'
import {
  AddRemoveProposalModal,
  AddRemoveProposalModalProps,
} from '../../components/Modal/AddRemoveProposalModal/AddRemoveProposalModal'
import {
  GRANT_PROPOSAL_SUBMIT_ENABLED,
  LINKED_WEARABLES_PROPOSAL_SUBMIT_ENABLED,
  PITCH_PROPOSAL_SUBMIT_ENABLED,
} from '../../constants'
import useFormatMessage from '../../hooks/useFormatMessage'
import { CatalystType, HiringType, PoiType, ProposalType } from '../../types/proposals'
import { getCommitteesWithOpenSlots } from '../../utils/committee'
import locations from '../../utils/locations'
import { isGrantProposalSubmitEnabled } from '../../utils/proposal'

import './submit.css'

const NOW = Date.now()

const POI_MODAL_PROPS: AddRemoveProposalModalProps = {
  open: false,
  proposalType: ProposalType.POI,
  addType: PoiType.AddPOI,
  removeType: PoiType.RemovePOI,
}

const HIRING_MODAL_PROPS: AddRemoveProposalModalProps = {
  open: false,
  proposalType: ProposalType.Hiring,
  addType: HiringType.Add,
  isAddDisabled: true,
  removeType: HiringType.Remove,
}

const CATALYST_MODAL_PROPS: AddRemoveProposalModalProps = {
  open: false,
  proposalType: ProposalType.Catalyst,
  addType: CatalystType.Add,
  removeType: CatalystType.Remove,
}

export default function SubmitPage() {
  const t = useFormatMessage()
  const [proposalModalProps, setProposalModalProps] = useState(POI_MODAL_PROPS)

  const closeProposalModal = () => setProposalModalProps((props) => ({ ...props, open: false }))
  const setHiringModalProps = async () => {
    setProposalModalProps({ ...HIRING_MODAL_PROPS, open: true })
    const availableCommittees = await getCommitteesWithOpenSlots()
    setProposalModalProps((prev) => ({ ...prev, isAddDisabled: availableCommittees.length === 0 }))
  }

  return (
    <>
      <Head
        title={t('page.submit.title')}
        description={t('page.submit.description')}
        links={[{ rel: 'canonical', href: locations.submit() }]}
      />
      <ContentLayout className="ProposalDetailPage" navigateBackUrl="/submit">
        <ContentSection>
          <Header size="huge">{t('page.submit.title')}</Header>
          <Text size="lg" weight="normal">
            {t('page.submit.description')}
          </Text>
        </ContentSection>
        <ContentSection>
          <Text className="SubmitPage__Header" size="sm" weight="semi-bold" color="secondary">
            {t('page.submit.common_actions')}
          </Text>
          <CategoryBanner
            type={ProposalType.Catalyst}
            onClick={() => setProposalModalProps({ ...CATALYST_MODAL_PROPS, open: true })}
          />
          <CategoryBanner
            type={ProposalType.POI}
            onClick={() => setProposalModalProps({ ...POI_MODAL_PROPS, open: true })}
          />
          <CategoryBanner type={ProposalType.BanName} href={locations.submit(ProposalType.BanName)} />
          {LINKED_WEARABLES_PROPOSAL_SUBMIT_ENABLED && (
            <CategoryBanner type={ProposalType.LinkedWearables} href={locations.submit(ProposalType.LinkedWearables)} />
          )}
          {GRANT_PROPOSAL_SUBMIT_ENABLED && (
            <CategoryBanner
              type={ProposalType.Grant}
              href={locations.submit(ProposalType.Grant)}
              active={isGrantProposalSubmitEnabled(NOW)}
            />
          )}
          <CategoryBanner type={ProposalType.Hiring} onClick={setHiringModalProps} />
        </ContentSection>
        {PITCH_PROPOSAL_SUBMIT_ENABLED && (
          <ContentSection>
            <Text className="SubmitPage__Header" size="sm" weight="semi-bold" color="secondary">
              {t('page.submit.bidding_tendering_process')}
            </Text>
            <CategoryBanner type={ProposalType.Pitch} href={locations.submit(ProposalType.Pitch)} />
          </ContentSection>
        )}
        <ContentSection>
          <Text className="SubmitPage__Header" size="sm" weight="semi-bold" color="secondary">
            {t('page.submit.governance_process')}
          </Text>
          <CategoryBanner type={ProposalType.Poll} href={locations.submit(ProposalType.Poll)} />
        </ContentSection>
      </ContentLayout>

      <AddRemoveProposalModal {...proposalModalProps} onClose={closeProposalModal} />
    </>
  )
}
