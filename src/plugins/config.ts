import fp from 'fastify-plugin'
import { type FastifyInstance } from 'fastify'
import dotenv from 'dotenv'
dotenv.config()

type ConfigType = {
  PORT: number
  JWT_SECRET: string
}

async function configPlugin(fastify: FastifyInstance) {
  const config: ConfigType = {
    PORT: Number(process.env.PORT) || 3002,
    JWT_SECRET: process.env.JWT_SECRET || 'secret'
  }

  fastify.decorate('config', config)
}

export default fp(configPlugin)
