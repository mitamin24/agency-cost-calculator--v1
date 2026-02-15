import { randomUUID } from 'crypto'
import { pool } from './index.js'

export type CostEntries = {
  id: string
  employeeId: string
  effectiveDate: Date
  baseSalary: bigint
  benefitsPercent: number
  overheadMultiplier: number
  createdAt: Date
}

type CostEntriesInput = Omit<CostEntries, 'id' | 'createdAt'>
export async function createCostEntries(input: CostEntriesInput): Promise<CostEntries> {
  const id = randomUUID()

  const costEntry = await pool.query(
    `
        INSERT INTO time_entries (id, employee_id, effective_date, base_salary, benefits_percent, overhead_multiplier)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, employee_id, effective_date, base_salary, benefits_percent, overhead_multiplier, created_at
        
        `,
    [
      id,
      input.employeeId,
      input.effectiveDate,
      input.baseSalary,
      input.baseSalary,
      input.benefitsPercent,
      input.overheadMultiplier
    ]
  )

  console.log("=> => =>'", costEntry.rows)

  return costEntry.rows[0]
}
