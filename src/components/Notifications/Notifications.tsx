import { useMemo, useState } from 'react'

import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'

import { NOTIFICATIONS_NEW_FEATURE_DISMISSED_LOCAL_STORAGE_KEY } from '../..//localStorageKeys'
import { Governance } from '../../clients/Governance'
import { PUSH_CHANNEL_ID } from '../../constants'
import { useAuthContext } from '../../context/AuthProvider'
import { DEFAULT_QUERY_STALE_TIME } from '../../hooks/constants'
import useFormatMessage from '../../hooks/useFormatMessage'
import { getCaipAddress, getPushNotificationsEnv } from '../../utils/notifications'
import { isSameAddress } from '../../utils/snapshot'
import NotificationBellActive from '../Icon/NotificationBellActive'
import NotificationBellInactive from '../Icon/NotificationBellInactive'

import './Notifications.css'
import NotificationsFeed from './NotificationsFeed'

export default function Notifications() {
  const t = useFormatMessage()
  const [user, userState] = useAuthContext()
  const [isOpen, setOpen] = useState(false)
  const chainId = userState.chainId || ChainId.ETHEREUM_SEPOLIA
  const queryClient = useQueryClient()
  const lastNotificationQueryKey = `lastNotificationId#${user}`
  const [isNewFeatureDismissed, setIsNewFeatureDismissed] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem(NOTIFICATIONS_NEW_FEATURE_DISMISSED_LOCAL_STORAGE_KEY) === 'true'
      : true
  )
  const mutation = useMutation(
    (newLastNotificationId: number) => {
      return Governance.get().updateUserLastNotification(newLastNotificationId)
    },
    {
      onMutate: async (newLastNotificationId: number) => {
        await queryClient.cancelQueries([lastNotificationQueryKey])
        const previousTodos = queryClient.getQueryData([lastNotificationQueryKey])
        queryClient.setQueryData([lastNotificationQueryKey], () => newLastNotificationId)
        return { previousTodos }
      },
      onError: (_error, _newLastNotificationId, context) => {
        queryClient.setQueryData([lastNotificationQueryKey], context?.previousTodos)
      },
    }
  )

  const env = getPushNotificationsEnv(chainId)

  const {
    data: subscriptions,
    refetch: refetchSubscriptions,
    isLoading: isLoadingSubscriptions,
    isRefetching: isRefetchingSubscriptions,
  } = useQuery({
    queryKey: ['pushSubscriptions', user],
    queryFn: async () => {
      const PushAPI = await import('@pushprotocol/restapi')

      return user
        ? PushAPI.user.getSubscriptions({
            user: getCaipAddress(user, chainId),
            env,
          })
        : null
    },
    enabled: !!user,
    staleTime: DEFAULT_QUERY_STALE_TIME,
  })

  const isSubscribed = useMemo(
    () => !!subscriptions?.find((item: { channel: string }) => isSameAddress(item.channel, PUSH_CHANNEL_ID)),
    [subscriptions]
  )

  const {
    data: userNotifications,
    isLoading: isLoadingNotifications,
    isRefetching: isRefetchingNotifications,
  } = useQuery({
    queryKey: [`notifications#${user}`],
    queryFn: () => (user ? Governance.get().getUserNotifications(user) : null),
    enabled: !!user && isSubscribed,
  })
  const latestNotification = userNotifications?.[0]?.payload_id

  const { data: lastNotificationId } = useQuery({
    queryKey: [lastNotificationQueryKey],
    queryFn: async () => {
      if (!user) {
        return null
      }

      const id = await Governance.get().getUserLastNotification()

      return id || null
    },
    enabled: !!user && isSubscribed,
  })

  const hasNewNotifications =
    Number(userNotifications?.length) > 0 && latestNotification && latestNotification !== lastNotificationId

  const handleFeedClose = () => {
    setOpen(false)

    if (!isNewFeatureDismissed) {
      localStorage.setItem(NOTIFICATIONS_NEW_FEATURE_DISMISSED_LOCAL_STORAGE_KEY, 'true')
      setIsNewFeatureDismissed(true)
    }

    if ((latestNotification && !lastNotificationId) || hasNewNotifications) {
      mutation.mutate(latestNotification)
    }
  }

  const showDot = (!isNewFeatureDismissed || hasNewNotifications) && !isOpen

  return (
    <>
      <div>
        <button
          className={classNames('Notifications__Button', isOpen && 'Notifications__Button--active')}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={t('navigation.notifications.button_label')}
        >
          {isOpen ? <NotificationBellActive /> : <NotificationBellInactive />}
          {showDot && (
            <div className="Notifications__DotOuterCircle">
              <div className="Notifications__DotInnerCircle" />
            </div>
          )}
        </button>
      </div>
      <NotificationsFeed
        isOpen={isOpen}
        onClose={handleFeedClose}
        userNotifications={userNotifications}
        onSubscriptionChangeSuccess={refetchSubscriptions}
        lastNotificationId={lastNotificationId}
        isSubscribed={isSubscribed}
        isLoadingNotifications={isLoadingNotifications}
        isRefetchingNotifications={isRefetchingNotifications}
        isLoadingSubscriptions={isLoadingSubscriptions}
        isRefetchingSubscriptions={isRefetchingSubscriptions}
      />
    </>
  )
}
