import { extractImageUrls } from './imageValidation'

describe('extractImageUrls', () => {
  it('should extract inline image URLs', () => {
    const markdown = '![Alt text](https://example.com/image.jpg)'
    expect(extractImageUrls(markdown)).toEqual(['https://example.com/image.jpg'])
  })

  it('should extract reference-style image URLs', () => {
    const markdown = `
      ![Alt text][ref1]
      [ref1]: https://example.com/image1.jpg
    `
    expect(extractImageUrls(markdown)).toEqual(['https://example.com/image1.jpg'])
  })

  it('should extract multiple image URLs', () => {
    const markdown = `
      ![First](https://example.com/1.jpg)
      ![Second](https://example.com/2.jpg)
      ![Third][ref]
      [ref]: https://example.com/3.jpg
    `
    expect(extractImageUrls(markdown)).toEqual([
      'https://example.com/1.jpg',
      'https://example.com/2.jpg',
      'https://example.com/3.jpg',
    ])
  })

  it('should handle markdown without images', () => {
    const markdown = 'Just some regular text with [a link](https://example.com)'
    expect(extractImageUrls(markdown)).toEqual([])
  })

  it('should handle empty string input', () => {
    expect(extractImageUrls('')).toEqual([])
  })

  it('should handle URLs with special characters', () => {
    const markdown = '![Test](https://example.com/image%20with%20spaces.jpg)'
    expect(extractImageUrls(markdown)).toEqual(['https://example.com/image%20with%20spaces.jpg'])
  })
})
