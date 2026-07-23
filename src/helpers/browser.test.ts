import { hasDangerousScheme, isRelativeLink, resolveLinkClickAction } from './browser'

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

  describe('when a dangerous scheme is obfuscated with an embedded tab', () => {
    beforeEach(() => {
      result = hasDangerousScheme('jav\tascript:alert(1)')
    })

    it('should still return true', () => {
      expect(result).toBe(true)
    })
  })

  describe('when a dangerous scheme is obfuscated with an embedded newline', () => {
    beforeEach(() => {
      result = hasDangerousScheme('java\nscript:alert(1)')
    })

    it('should still return true', () => {
      expect(result).toBe(true)
    })
  })

  describe('when a dangerous scheme is obfuscated with an embedded carriage return', () => {
    beforeEach(() => {
      result = hasDangerousScheme('java\rscript:alert(1)')
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

describe('resolveLinkClickAction', () => {
  let action: ReturnType<typeof resolveLinkClickAction>

  describe('when the href uses a dangerous scheme and targets a new tab', () => {
    beforeEach(() => {
      action = resolveLinkClickAction('javascript:alert(1)', '_blank', false, false)
    })

    it('should block it', () => {
      expect(action).toBe('block')
    })
  })

  describe('when the href uses a dangerous scheme and does not target a new tab', () => {
    beforeEach(() => {
      action = resolveLinkClickAction('javascript:alert(1)', undefined, false, false)
    })

    it('should still block it', () => {
      expect(action).toBe('block')
    })
  })

  describe('when the href uses a dangerous scheme obfuscated with an embedded tab', () => {
    beforeEach(() => {
      action = resolveLinkClickAction('jav\tascript:alert(1)', '_blank', false, false)
    })

    it('should block it', () => {
      expect(action).toBe('block')
    })
  })

  describe('when the href is an external link that opens in a new tab', () => {
    beforeEach(() => {
      action = resolveLinkClickAction('https://example.org', '_blank', false, false)
    })

    it('should navigate', () => {
      expect(action).toBe('navigate')
    })
  })

  describe('when an external new-tab link is opened with a meta/modifier click', () => {
    beforeEach(() => {
      action = resolveLinkClickAction('https://example.org', '_blank', true, false)
    })

    it('should defer to the default browser behavior', () => {
      expect(action).toBe('default')
    })
  })

  describe('when an external link does not target a new tab', () => {
    beforeEach(() => {
      action = resolveLinkClickAction('https://example.org', undefined, false, false)
    })

    it('should defer to the default browser behavior', () => {
      expect(action).toBe('default')
    })
  })

  describe('when the href is relative', () => {
    beforeEach(() => {
      action = resolveLinkClickAction('/proposal?id=1', '_blank', false, false)
    })

    it('should defer to the default browser behavior', () => {
      expect(action).toBe('default')
    })
  })

  describe('when the default has already been prevented', () => {
    beforeEach(() => {
      action = resolveLinkClickAction('https://example.org', '_blank', false, true)
    })

    it('should defer to the default browser behavior', () => {
      expect(action).toBe('default')
    })
  })
})
