import { ErrorClient } from '../clients/ErrorClient'
import { Reaction, Survey, TopicFeedback } from '../types/surveyTopics'

import { ErrorCategory } from './errorCategories'

type ReactionWithIcon = { reaction: Reaction; icon: string }
export const REACTION_LIST: ReactionWithIcon[] = [
  { reaction: Reaction.LOVE, icon: '🥰' },
  { reaction: Reaction.LIKE, icon: '😊' },
  { reaction: Reaction.NEUTRAL, icon: '😐' },
  { reaction: Reaction.CONCERNED, icon: '🤨' },
  { reaction: Reaction.EMPTY, icon: '-' },
]

export class SurveyEncoder {
  static encode(survey?: Survey | null): string {
    if (!survey || survey.length < 1) survey = []
    try {
      const encodedSurvey: Record<string, unknown> = { survey }
      return JSON.stringify(encodedSurvey)
    } catch (error) {
      ErrorClient.report('Unable to encode survey', { error, survey, category: ErrorCategory.Voting })
      return '{"survey":[]}'
    }
  }
}

const has = <K extends string>(key: K, x: object): x is { [key in K]: unknown } => key in x

function isValidTopicFeedback(rawTopicFeedback: never) {
  return (
    typeof rawTopicFeedback === 'object' &&
    rawTopicFeedback !== null &&
    has('topic_id', rawTopicFeedback) &&
    has('reaction', rawTopicFeedback)
  )
}

function isValidTopicId(rawTopic: unknown) {
  return rawTopic !== null && typeof rawTopic === 'string' && rawTopic.length > 0
}

function isReactionType(value: string | null | undefined): boolean {
  switch (value) {
    case Reaction.EMPTY:
    case Reaction.LOVE:
    case Reaction.LIKE:
    case Reaction.CONCERNED:
    case Reaction.NEUTRAL:
      return true
    default:
      return false
  }
}

function isUnique(decodedSurvey: TopicFeedback[], topicFeedback: TopicFeedback) {
  return !decodedSurvey.find((topic) => topic.topic_id === topicFeedback.topic_id)
}

export function decodeSurvey(encodedSurvey?: Record<string, unknown>): Survey {
  const decodedSurvey: Survey = []
  if (!encodedSurvey || Object.keys(encodedSurvey).length === 0) return decodedSurvey
  try {
    const rawSurvey: unknown = encodedSurvey?.survey
    if (Object.prototype.toString.call(rawSurvey) === '[object Array]') {
      const arraySurvey = rawSurvey as []
      arraySurvey.forEach((rawTopicFeedback) => {
        if (isValidTopicFeedback(rawTopicFeedback)) {
          const topicFeedback = rawTopicFeedback as TopicFeedback
          if (
            isValidTopicId(topicFeedback.topic_id) &&
            isReactionType(topicFeedback.reaction) &&
            isUnique(decodedSurvey, topicFeedback)
          )
            decodedSurvey.push(topicFeedback)
        }
      })
    }
    return decodedSurvey
  } catch (e) {
    console.log(`Unable to parse encoded survey ${encodedSurvey}`)
    return decodedSurvey
  }
}
