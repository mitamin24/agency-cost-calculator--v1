import fp from 'fastify-plugin'
import { type FastifyInstance } from 'fastify'

type ConfigType = {
  PORT: number
}

async function configPlugin(fastify: FastifyInstance) {
  const config: ConfigType = {
    PORT: Number(process.env.PORT) || 3002
  }

  fastify.decorate('config', config)
}

export default fp(configPlugin)
