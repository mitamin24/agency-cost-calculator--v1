import type { FastifyInstance } from 'fastify'
import { createUser } from '../db/users.js'

export default async function publicRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return { status: 'ok' }
  })

  // Example: Super simple! No try-catch needed!
  // Errors automatically bubble up to the error handler
  fastify.post('/users', async (req) => {
    const user = await createUser(req.body as any)
    return user // That's it! If there's an error, it's handled automatically
  })
}
