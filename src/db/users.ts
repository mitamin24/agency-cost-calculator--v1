import { randomUUID } from 'crypto'
import { pool } from './index.js'
import {
  createConflictError,
  createInvalidInputError,
  createDatabaseError
} from '../errors/DatabaseErrors.js'

export type Role =
  | 'frontend engineer'
  | 'cto'
  | 'senior developer'
  | 'lead designer'
  | 'ui/ux designer'
  | 'founder'
  | 'manager'
  | 'backend engineer'
  | 'devops'
  | 'marketer'
  | 'sales rep'

export type Department =
  | 'frontend'
  | 'backend'
  | 'marketing'
  | 'sales'
  | 'technical support'
  | 'testing'
  | 'devops'
  | 'all'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  department: Department
  createdAt: Date
}

type CreateUserInput = Omit<User, 'id' | 'createdAt'>
export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    const id = randomUUID()

    const user = await pool.query(
      `
            INSERT INTO employees(id, name, email, role, department)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, role, department, created_at   

            `,
      [id, input.name, input.email, input.role, input.department]
    )

    console.log('=> => =>', user.rows)

    return user.rows[0]
  } catch (err) {
    // Handle PostgreSQL errors
    if (err && typeof err === 'object' && 'code' in err) {
      // Duplicate key error (e.g., email already exists)
      if (err.code === '23505') {
        throw createConflictError('Email already exists')
      }

      // Foreign key violation
      if (err.code === '23503') {
        throw createInvalidInputError('Invalid reference')
      }
    }

    // Any other error is a database error
    throw createDatabaseError('Failed to create user')
  }
}
