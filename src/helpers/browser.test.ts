import { hasDangerousScheme, isRelativeLink } from './browser'

describe('hasDangerousScheme', () => {
  let result: boolean

  describe('when the href uses the javascript scheme', () => {
    beforeEach(() => {
      result = hasDangerousScheme('javascript:alert(1)')
    })

    it('should return true', () => {
      expect(result).toBe(true)
    })
  })

  describe('when the href uses the data scheme', () => {
    beforeEach(() => {
      result = hasDangerousScheme('data:text/html,<script>alert(1)</script>')
    })

    it('should return true', () => {
      expect(result).toBe(true)
    })
  })

  describe('when the href uses the vbscript scheme', () => {
    beforeEach(() => {
      result = hasDangerousScheme('vbscript:msgbox(1)')
    })

    it('should return true', () => {
      expect(result).toBe(true)
    })
  })

  describe('when a dangerous scheme is prefixed with leading whitespace and control characters', () => {
    beforeEach(() => {
      result = hasDangerousScheme('\t\n javascript:alert(1)')
    })

    it('should still return true', () => {
      expect(result).toBe(true)
    })
  })

  describe('when the scheme casing is mixed', () => {
    beforeEach(() => {
      result = hasDangerousScheme('JaVaScRiPt:alert(1)')
    })

    it('should return true', () => {
      expect(result).toBe(true)
    })
  })

  describe('when the href is a root-relative path', () => {
    beforeEach(() => {
      result = hasDangerousScheme('/proposal?id=1')
    })

    it('should return false', () => {
      expect(result).toBe(false)
    })
  })

  describe('when the href is an https url', () => {
    beforeEach(() => {
      result = hasDangerousScheme('https://decentraland.org')
    })

    it('should return false', () => {
      expect(result).toBe(false)
    })
  })

  describe('when the word javascript appears later in the path rather than as the scheme', () => {
    beforeEach(() => {
      result = hasDangerousScheme('https://example.org/javascript:foo')
    })

    it('should return false', () => {
      expect(result).toBe(false)
    })
  })

  describe('when the href is undefined', () => {
    beforeEach(() => {
      result = hasDangerousScheme(undefined)
    })

    it('should return false', () => {
      expect(result).toBe(false)
    })
  })
})

describe('isRelativeLink', () => {
  let result: boolean

  describe('when the href is an absolute https url', () => {
    beforeEach(() => {
      result = isRelativeLink('https://decentraland.org')
    })

    it('should return false', () => {
      expect(result).toBe(false)
    })
  })

  describe('when the href is an absolute http url', () => {
    beforeEach(() => {
      result = isRelativeLink('http://decentraland.org')
    })

    it('should return false', () => {
      expect(result).toBe(false)
    })
  })

  describe('when the href is protocol-relative', () => {
    beforeEach(() => {
      result = isRelativeLink('//cdn.decentraland.org')
    })

    it('should return false', () => {
      expect(result).toBe(false)
    })
  })

  describe('when the href is a root-relative path', () => {
    beforeEach(() => {
      result = isRelativeLink('/proposal?id=1')
    })

    it('should return true', () => {
      expect(result).toBe(true)
    })
  })

  describe('when the href is undefined', () => {
    beforeEach(() => {
      result = isRelativeLink(undefined)
    })

    it('should return false', () => {
      expect(result).toBe(false)
    })
  })
})
