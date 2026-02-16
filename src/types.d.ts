import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: Number
      JWT_SECRET: string
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: number | null
  }
}
