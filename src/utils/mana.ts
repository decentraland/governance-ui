import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { buildWallet } from 'decentraland-dapps/dist/modules/wallet/utils/buildWallet'
import { ManaBalancesProps } from 'decentraland-ui/dist/components/UserMenu/ManaBalances/ManaBalances.types'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import { ErrorClient } from '../clients/ErrorClient'

export async function fetchManaBalance(address: string, chainId: ChainId) {
  if (!isEthereumAddress(address)) {
    return {}
  }

  try {
    const { networks } = await buildWallet(chainId)
    const manaBalances: ManaBalancesProps['manaBalances'] = {}
    const networkList = [Network.ETHEREUM, Network.MATIC]
    for (const network of networkList as [Network.ETHEREUM, Network.MATIC]) {
      const networkData = networks[network]
      if (networkData) {
        manaBalances[network] = networks[network].mana
      }
    }

    return manaBalances
  } catch (err) {
    console.error(err)
    ErrorClient.report('Error fetching MANA balance', { address, chainId })

    return 0
  }
}
