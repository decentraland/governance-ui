/**
 * @jest-environment jsdom
 */
import { Helmet } from 'react-helmet'

import { render } from '@testing-library/react'

import Head from './Head.tsx'

// jest.setup.ts mocks the constants module with only GOVERNANCE_API, so without this the default image
// is undefined here and an assertion on it passes whether or not the fallback exists.
const DCL_META_IMAGE_URL = 'https://example.org/default.png'
jest.mock('../../constants', () => ({
  DCL_META_IMAGE_URL: 'https://example.org/default.png',
  GOVERNANCE_URL: 'https://decentraland.org/governance',
}))

// Helmet types the peeked tags as HTMLMetaElement, which has no `property`, but og:* tags carry one.
const findMeta = (key: string) =>
  Helmet.peek().metaTags.find((meta) => meta.name === key || (meta as { property?: string }).property === key)

describe('Head', () => {
  describe('when no page passes an image', () => {
    beforeEach(() => {
      render(<Head title="A title" description="A description" />)
    })

    it('should fall back to the default preview image for og:image', () => {
      const tag = findMeta('og:image')

      expect(tag?.content).toBe(DCL_META_IMAGE_URL)
    })

    it('should fall back to the same preview image for twitter:image, not drop it', () => {
      const tag = findMeta('twitter:image')

      expect(tag?.content).toBe(DCL_META_IMAGE_URL)
    })
  })

  describe('when a page passes an image', () => {
    const image = 'https://example.org/proposal.png'

    beforeEach(() => {
      render(<Head title="A title" description="A description" image={image} />)
    })

    it('should use it for og:image and twitter:image', () => {
      expect(findMeta('og:image')?.content).toBe(image)
      expect(findMeta('twitter:image')?.content).toBe(image)
    })
  })
})
