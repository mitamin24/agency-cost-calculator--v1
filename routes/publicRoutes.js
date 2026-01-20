export default async function publicRoutes(fastify) {
    fastify.get('/health', async () => {
        return { status: 'ok' }
    })
}