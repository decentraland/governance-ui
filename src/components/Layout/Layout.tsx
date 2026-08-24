import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { Avatar } from '@dcl/schemas/dist/platform/profile'
import { useQuery } from '@tanstack/react-query'
import NotificationSlot from 'decentraland-dapps/dist/containers/Navbar/NotificationSlot'
import {
  DROPDOWN_MENU_BALANCE_CLICK_EVENT,
  DROPDOWN_MENU_DISPLAY_EVENT,
  DROPDOWN_MENU_SIGN_OUT_EVENT,
} from 'decentraland-dapps/dist/containers/Navbar/constants'
import useNotifications from 'decentraland-dapps/dist/hooks/useNotifications'
import { Navbar } from 'decentraland-ui2'
import { Footer } from 'decentraland-ui/dist/components/Footer/Footer'
import { ManaBalancesProps } from 'decentraland-ui/dist/components/UserMenu/ManaBalances/ManaBalances.types'
import { config } from 'decentraland-ui/dist/config'
import { isEmpty } from 'lodash'

import { useAuthContext } from '../../context/AuthProvider'
import { addressShortener, getSupportedChainIds } from '../../helpers'
import useAnalyticsTrack from '../../hooks/useAnalyticsTrack'
import useDclFeatureFlags from '../../hooks/useDclFeatureFlags'
import useDclIdentity from '../../hooks/useDclIdentity'
import useDclProfile from '../../hooks/useDclProfile'
import { getAnalytics } from '../../utils/analytics/segment'
import { FeatureFlags } from '../../utils/features'
import { fetchManaBalance } from '../../utils/mana'
import AvatarComponent from '../Common/Avatar'
import ExternalLinkWarningModal from '../Modal/ExternalLinkWarningModal'
import { LinkDiscordModal } from '../Modal/LinkDiscordModal/LinkDiscordModal'
import WrongNetworkModal from '../Modal/WrongNetworkModal'

import './Layout.css'
import { LayoutContainer } from './Layout.styled'

type LayoutProps = {
  children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [user, userState] = useAuthContext()
  const track = useAnalyticsTrack()
  const { isFeatureFlagEnabled } = useDclFeatureFlags()
  const location = useLocation()

  const analytics = getAnalytics()

  useEffect(() => {
    analytics?.page()
  }, [analytics, location])

  const handleSwitchNetwork = useCallback((chainId: ChainId) => userState.switchTo(chainId), [userState])

  const { profile, isLoadingDclProfile } = useDclProfile(user)
  const chainId = userState.chainId
  const isAuthDappEnabled = isFeatureFlagEnabled(FeatureFlags.AuthDapp)

  const { data: manaBalances } = useQuery({
    queryKey: ['manaBalances', user, chainId],
    queryFn: async () => {
      if (!user || !chainId) {
        return {}
      }
      return Promise.resolve(fetchManaBalance(user, chainId))
    },
    enabled: !!user,
  })

  const handleClickBalance = useCallback(
    (network: Network) => {
      track(DROPDOWN_MENU_BALANCE_CLICK_EVENT, { network })

      setTimeout(() => {
        window.open(config.get('ACCOUNT_URL'), '_blank', 'noopener')
      }, 300)
    },
    [track]
  )

  const handleToggleUserCard = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        track(DROPDOWN_MENU_DISPLAY_EVENT, {})
      }
    },
    [track]
  )

  const handleSignOut = useCallback(() => {
    track(DROPDOWN_MENU_SIGN_OUT_EVENT, {})
    setTimeout(() => {
      userState.disconnect()
    }, 300)
  }, [track, userState])

  const withNotifications = true
  const dclIdentity = useDclIdentity()
  const hasProfile = !isEmpty(profile)
  const { isModalOpen, isLoading, notifications, handleNotificationsOpen } = useNotifications(
    dclIdentity,
    withNotifications
  )

  return (
    <LayoutContainer>
      <Navbar
        manaBalances={manaBalances as ManaBalancesProps['manaBalances']}
        address={user || undefined}
        avatar={hasProfile ? (profile as unknown as Avatar) : undefined}
        isSignedIn={hasProfile}
        isSigningIn={userState.loading || isLoadingDclProfile}
        onClickBalance={handleClickBalance}
        onToggleUserCard={handleToggleUserCard}
        onClickSignIn={isAuthDappEnabled ? userState.authorize : userState.select}
        onClickSignOut={handleSignOut}
        notificationSlot={
          withNotifications ? (
            <NotificationSlot
              locale="en"
              isLoading={isLoading}
              isOpen={isModalOpen}
              notifications={notifications}
              onToggle={handleNotificationsOpen}
              renderProfile={(address: string) => (
                <div className="layout__notifications-profile">
                  <AvatarComponent address={address} size="xs" /> {addressShortener(address)}
                </div>
              )}
            />
          ) : undefined
        }
      />

      <main>{children}</main>
      <WrongNetworkModal
        currentNetwork={chainId}
        expectedNetworks={getSupportedChainIds()}
        onSwitchNetwork={handleSwitchNetwork}
        providerType={userState.providerType}
      />
      <LinkDiscordModal />
      <ExternalLinkWarningModal />
      <Footer locale="en" locales={['en']} isFullWidth={false} className="WiderFooter" />
    </LayoutContainer>
  )
}
