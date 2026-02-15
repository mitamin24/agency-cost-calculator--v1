import Fastify, {
  type FastifyError,
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest
} from 'fastify'
import configPlugin from './plugins/config.js'
import publicRoutes from './routes/publicRouter.js'
import privateRoutes from './routes/privateRouter.js'
import authConfig from './plugins/config.js'
import dotenv from 'dotenv'
import { isAppError } from './errors/DatabaseErrors.js'
dotenv.config()

const fastify: FastifyInstance = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: false,
      useDefaults: false,
      coerceTypes: false,
      allErrors: true
    }
  }
})

// Config
fastify.register(configPlugin)

// Routes
fastify.register(publicRoutes)

// Auth and private routes
fastify.register(async (fastify: FastifyInstance) => {
  fastify.register(authConfig)
  fastify.register(privateRoutes)
})

fastify.setErrorHandler((err: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
  fastify.log.error(err)

  // Handle our custom app errors (plain objects)
  if (isAppError(err)) {
    switch (err.type) {
      case 'CONFLICT':
        return reply.status(409).send({
          error: err.type,
          message: err.message
        })
      case 'NOT_FOUND':
        return reply.status(404).send({
          error: err.type,
          message: err.message
        })
      case 'INVALID_INPUT':
        return reply.status(400).send({
          error: err.type,
          message: err.message
        })
      case 'DATABASE_ERROR':
        return reply.status(500).send({
          error: err.type,
          message: 'An error occurred while processing your request'
        })
    }
  }

  // request validation error
  if (err.validation && err.validationContext === 'body') {
    return reply.code(400).send({
      error: 'INVALID REQUEST ERROR',
      message: err.message
    })
  }

  // respopnse validation error
  if (err.code === 'FST_ERR_RESPONSE_SERIALIZATION') {
    return reply.status(401).send({
      err: 'INVALID RESPONSE ERROR',
      message: err.message
    })
  }

  reply.code(500).send({
    error: 'INTERNAL SERVER ERROR',
    message: err.message
  })
})

async function start() {
  try {
    await fastify.ready()
    const address = await fastify.listen({ port: Number(process.env.PORT || 3002) })
    console.log(`Server is running at ${address}`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}
start()
