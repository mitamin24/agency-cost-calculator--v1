import { randomUUID } from 'crypto'
import { pool } from './index.js'

export type TimeEntries = {
  id: string
  employeeId: string
  date: Date
  hours: number
  project: string
  createdAt: Date
}

type TimeEntriesInput = Omit<TimeEntries, 'id' | 'createdAt'>
export async function createTimeEntries(input: TimeEntriesInput): Promise<TimeEntries> {
  const id = randomUUID()

  const timeEntry = await pool.query(
    `
        INSERT INTO time_entries ( id, employee_id, date, hours, project)
        VALUES ($1, $2, $3, $4, $5)
        
        `,
    [id, input.employeeId, input.date, input.hours, input.project]
  )

  console.log('=> => => ', timeEntry)

  return timeEntry.rows[0]
}
