import Fastify from "fastify";
import dotenv from "dotenv"
dotenv.config()
import configPlugin from "./plugins/config.js"
import publicRoutes from "./routes/publicRoutes.js"
import authConfig from "./plugins/auth.js"
import privateRoutes from "./routes/privateRoutes.js"

const fastify = Fastify({logger: true, 
    ajv: {
        customOptions: {
            removeAdditional: false,
            useDefaults: false,
            coerceTypes: false,
            allErrors: true
        }
}})

// Config
fastify.register(configPlugin)

// Routes
fastify.register(publicRoutes)

// Auth and private routes
fastify.register (async (fastify) => {
  fastify.register(authConfig)
  fastify.register(privateRoutes)

})



fastify.setErrorHandler((err, req, reply) => {

  fastify.log.error(err)

  // request validation error
  if (err.validation && err.validationContext === 'body') {
    return reply.code(400).send({
      error: "INVALID REQUEST ERROR",
      message: err.message
    })
  }

  // respopnse validation error
  if (err.serialization) {
    return reply.status(401).send({
      err: "INVALID RESPONSE ERROR",
      message: err.message
    })
  }

  reply.code(500).send({
    error: "INTERNAL SERVER ERROR",
    message: err.message
  })

})

async function start() {
      try {
        await fastify.ready()
        fastify.listen({port: fastify.config.PORT})
        console.log("server is running on port => =>", fastify.config.PORT);
      } catch (err) {
        fastify.log(err)
        process.exit(1)
      }  
}
start()
