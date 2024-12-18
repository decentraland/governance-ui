import { extractImageUrls, validateObjectMarkdownImages } from './imageValidation'
import { isValidImage } from './proposal'

jest.mock('./proposal', () => ({
  isValidImage: jest.fn(),
}))

const mockIsValidImage = isValidImage as jest.MockedFunction<typeof isValidImage>

describe('Image Validation Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validateObjectMarkdownImages', () => {
    const mockGovernanceProposal = {
      linked_proposal_id: 'abc-123',
      title: 'Test Proposal',
      summary: 'A test proposal summary',
      abstract: 'Test abstract with ![image](https://valid-image.com/1.jpg)',
      motivation: 'Test motivation with ![invalid](https://invalid-image.com/bad.jpg)',
      specification: 'Test spec with ![valid](https://valid-image.com/2.jpg)',
      impacts: 'Test impacts section',
      implementation_pathways: 'Implementation details ![another](https://valid-image.com/3.jpg)',
      conclusion: 'Final thoughts',
      coAuthors: ['0x123...'],
    }

    const mockTenderProposal = {
      linked_proposal_id: 'xyz-789',
      project_name: 'Test Project',
      summary: 'Project summary with ![image](https://valid-image.com/1.jpg)',
      problem_statement: 'Problem details ![invalid](https://invalid-image.com/bad.jpg)',
      technical_specification: 'Tech specs',
      use_cases: 'Use cases ![valid](https://valid-image.com/2.jpg)',
      deliverables: 'Deliverables section',
      target_release_quarter: 'Q4 2024',
    }

    it('should validate all images in a governance proposal across all fields', async () => {
      mockIsValidImage
        .mockResolvedValueOnce(true) // first image
        .mockResolvedValueOnce(false) // second image
        .mockResolvedValueOnce(true) // third image
        .mockResolvedValueOnce(true) // fourth image

      const result = await validateObjectMarkdownImages(mockGovernanceProposal)

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual(['https://invalid-image.com/bad.jpg'])
      expect(mockIsValidImage).toHaveBeenCalledTimes(4)
    })

    it('should validate all images in a tender proposal across all fields', async () => {
      mockIsValidImage
        .mockResolvedValueOnce(true) // first image
        .mockResolvedValueOnce(false) // second image
        .mockResolvedValueOnce(true) // third image

      const result = await validateObjectMarkdownImages(mockTenderProposal)

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual(['https://invalid-image.com/bad.jpg'])
      expect(mockIsValidImage).toHaveBeenCalledTimes(3)
    })

    it('should return valid when no images are present', async () => {
      const bidRequestWithoutImages = {
        // BidRequestFunding
        funding: '10000',
        projectDuration: 6,
        deliveryDate: '2024-12-31',
        beneficiary: '0x123456789abcdef',
        email: 'test@example.com',

        // BidRequestGeneralInfo
        teamName: 'Test Team',
        deliverables: 'Test deliverables with detailed description',
        roadmap: 'Test roadmap with project milestones',
        milestones: [
          {
            title: 'Milestone 1',
            delivery_date: '2024-06-30',
            tasks: 'Initial development phase',
          },
          {
            title: 'Milestone 2',
            delivery_date: '2024-09-30',
            tasks: 'Testing and deployment',
          },
        ],

        // ProposalRequestTeam
        members: [
          {
            name: 'John Doe',
            address: '0x987654321fedcba',
            role: 'Lead Developer',
            about: 'Experienced blockchain developer',
            relevantLink: 'https://github.com/johndoe',
          },
        ],

        // BidRequestDueDiligence
        budgetBreakdown: [
          {
            concept: 'Development',
            duration: 3,
            estimatedBudget: '5000',
            aboutThis: 'Core development work',
            relevantLink: 'https://example.com/dev-plan',
          },
          {
            concept: 'Testing',
            duration: 2,
            estimatedBudget: '3000',
            aboutThis: 'Testing and QA',
            relevantLink: 'https://example.com/test-plan',
          },
        ],

        // Required fields
        linked_proposal_id: 'xyz-789',
        coAuthors: ['0x111222333'],
      }

      const result = await validateObjectMarkdownImages(bidRequestWithoutImages)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
      expect(mockIsValidImage).not.toHaveBeenCalled()
    })
  })

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
})
