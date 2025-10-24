import fetch from 'isomorphic-fetch'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import { isSameAddress } from '../../utils/snapshot'

import { CatalystProfile, DclProfile, ProfileResponse } from './types'

const CATALYST_URL = 'https://peer.decentraland.org'
const CATALYST_FALLBACKS = [
  'https://peer-ec2.decentraland.org',
  'https://interconnected.online',
  'https://peer.decentral.io',
]

export const DEFAULT_AVATAR_IMAGE = 'https://decentraland.org/images/male.png'

function getUsername(profile: CatalystProfile | null, address: string) {
  const hasName = !!profile && !!profile.name && profile.name.length > 0
  if (!hasName) return null

  const { hasClaimedName, name } = profile
  return hasClaimedName ? name : `${name.split('#')[0]}#${address.slice(-4)}`
}

const createDefaultProfile = (address: string): CatalystProfile => ({
  userId: address,
  ethAddress: address,
  hasClaimedName: false,
  avatar: {
    snapshots: {
      face: DEFAULT_AVATAR_IMAGE,
      face128: DEFAULT_AVATAR_IMAGE,
      face256: DEFAULT_AVATAR_IMAGE,
      body: '',
    },
    bodyShape: 'dcl://base-avatars/BaseMale',
    eyes: {
      color: { r: 0.125, g: 0.703125, b: 0.96484375 },
    },
    hair: {
      color: { r: 0.234375, g: 0.12890625, b: 0.04296875 },
    },
    skin: {
      color: { r: 0.94921875, g: 0.76171875, b: 0.6484375 },
    },
    wearables: [
      'dcl://base-avatars/green_hoodie',
      'dcl://base-avatars/brown_pants',
      'dcl://base-avatars/sneakers',
      'dcl://base-avatars/casual_hair_01',
      'dcl://base-avatars/beard',
    ],
    version: 0,
  },
  name: '',
  email: '',
  description: '',
  blocked: [],
  inventory: [],
  version: 0,
  tutorialStep: 0,
  isDefaultProfile: true,
})

function hasFaceSnapshot(p: CatalystProfile | null): p is CatalystProfile {
  return !!p?.avatar?.snapshots?.face
}

function getDclProfile(profile: CatalystProfile | null, address: string): DclProfile {
  const username = getUsername(profile, address)
  const hasAvatar = !!profile?.avatar
  const face256 =
    profile?.avatar?.snapshots?.face256 ?? (hasFaceSnapshot(profile) ? profile.avatar.snapshots.face : '') ?? ''

  const avatarUrl = face256 && face256.length > 0 ? face256 : DEFAULT_AVATAR_IMAGE

  if (!profile) {
    return {
      ...createDefaultProfile(address),
      username,
      avatarUrl,
      hasCustomAvatar: hasAvatar,
      address: address.toLowerCase(),
    }
  }

  return {
    ...profile,
    username,
    avatarUrl,
    hasCustomAvatar: hasAvatar,
    address: address.toLowerCase(),
  }
}

async function fetchProfilesFrom(base: string, address: string) {
  const url = `${base}/lambdas/profiles/${address}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Catalyst ${base} returned ${res.status}`)
  return res.json() as Promise<ProfileResponse>
}

export async function getProfile(address: string): Promise<DclProfile> {
  if (!address || !isEthereumAddress(address)) {
    throw new Error(`Invalid address provided. Value: ${address}`)
  }
  try {
    const r1 = await fetchProfilesFrom(CATALYST_URL, address)
    if (r1.avatars?.length > 0) {
      const profile = r1.avatars[0]
      return getDclProfile(profile, address)
    }
  } catch (err) {
    console.warn('Primary catalyst failed', { err })
  }
  for (const catalyst of CATALYST_FALLBACKS) {
    try {
      const r = await fetchProfilesFrom(catalyst, address)
      if (r.avatars?.length > 0) {
        const profile = r.avatars[0]
        return getDclProfile(profile, address)
      }
    } catch {
      //  next peer
    }
  }
  return getDclProfile(null, address)
}

export async function getProfiles(addresses: string[]): Promise<DclProfile[]> {
  for (const address of addresses) {
    if (!isEthereumAddress(address)) {
      throw new Error(`Invalid address provided. Value: ${address}`)
    }
  }
  const response: ProfileResponse[] = await (
    await fetch(`${CATALYST_URL}/lambdas/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: addresses }),
    })
  ).json()

  const profiles: DclProfile[] = []

  for (const address of addresses) {
    const profile = response.find((p) => isSameAddress(p.avatars[0]?.ethAddress, address))
    profiles.push(getDclProfile(profile?.avatars[0] || null, address))
  }

  return profiles
}

export function getContentUrl(hash: string) {
  return `${CATALYST_URL}/content/contents/${hash}`
}

type ContentEntityScene = {
  content: { file: string; hash: string }[]
  metadata: {
    display?: {
      navmapThumbnail?: string // "scene-thumbnail.png" | "https://decentraland.org/images/thumbnail.png"
    }
  }
}

export async function getEntityScenes(pointers: (string | [number, number])[]): Promise<ContentEntityScene[]> {
  if (!pointers || pointers.length === 0) return []

  const params = pointers
    .map((point) => 'pointer=' + (Array.isArray(point) ? point.slice(0, 2).join(',') : point))
    .join('&')

  return await (await fetch(`${CATALYST_URL}/content/entities/scene?` + params)).json()
}
