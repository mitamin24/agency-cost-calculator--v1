import fp from 'fastify-plugin'

async function configPlugin(fastify) {
    const config = {
        PORT: process.env.PORT || 3002
    }
    fastify.decorate('config', config)
}

export default fp(configPlugin)