/// <reference types="vite/client" />

declare global {
  interface Window {
    /**
     * EIP-1193 provider injected by wallet extensions (MetaMask, Coinbase Wallet, etc).
     * We keep it loosely typed because different wallets add different flags.
     */
    ethereum?: {
      isMetaMask?: boolean
      isRabby?: boolean
      isDapper?: boolean
      isCucumber?: boolean
      isTrust?: boolean
      isToshi?: boolean
      isGoWallet?: boolean
      isAlphaWallet?: boolean
      isStatus?: boolean
      [key: string]: unknown
    }
  }
}

export {}
