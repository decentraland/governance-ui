import { NewGrantCategory } from './grants'

export type QuarterCategoryBudgetAttributes = {
  quarter_budget_id: string
  category: NewGrantCategory
  total: number
  allocated: number
  created_at: Date
  updated_at: Date
}
