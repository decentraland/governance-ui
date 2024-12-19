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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function validateValue(value: any, errors: string[]) {
  if (typeof value === 'string') {
    const imageUrls = extractImageUrls(value)
    for (const imageUrl of imageUrls) {
      const isValid = await isValidImage(imageUrl)
      if (!isValid) {
        errors.push(imageUrl)
      }
    }
  } else if (value && typeof value === 'object') {
    await validateObject(value, errors)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function validateObject(obj: any, errors: string[]) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      await validateValue(item, errors)
    }
  } else {
    for (const key in obj) {
      await validateValue(obj[key], errors)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function validateObjectMarkdownImages(obj: any): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = []

  await validateObject(obj, errors)

  return {
    isValid: errors.length === 0,
    errors,
  }
}
