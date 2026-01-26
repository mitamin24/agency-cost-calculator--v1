import type { FastifyInstance } from "fastify"

export default async function publicRoutes(fastify:FastifyInstance) {
    fastify.get('/health', async () => {
        return {status: 'ok'}
    })
}