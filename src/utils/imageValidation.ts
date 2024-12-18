import { isValidImage } from './proposal'

export async function valdidateImagesUrls(proposalSection: string) {
  const imageUrls = extractImageUrls(proposalSection)

  const errors: string[] = []
  for (const imageUrl of imageUrls) {
    const isValid = await isValidImage(imageUrl)
    if (!isValid) {
      errors.push(imageUrl)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function extractImageUrls(markdown: string): string[] {
  const imageRegex = /!\[.*?\]\((.*?)\)|\[.*?\]:\s*(.*?)(?:\s|$)/g
  const urls: string[] = []
  let match

  while ((match = imageRegex.exec(markdown)) !== null) {
    const url = match[1] || match[2]
    if (url) urls.push(url)
  }

  return urls
}
