import fp from "fastify-plugin"
import { type FastifyInstance } from "fastify"
import type{ FastifyRequest,FastifyReply } from "fastify"

async function authConfig(fastify: FastifyInstance) {

    // Initialize user decoration
    fastify.decorateRequest('user', null) 

    fastify.addHook('preHandler', async (req: FastifyRequest, reply: FastifyReply) => {

        const authHeader = Number(req.headers.authorization)

        if (!authHeader || isNaN(authHeader)) {
            return reply.code(401).send({
                error: "UNAUTHORIZED"
            })
        }

        const userId: number = authHeader
        console.log("user id => =>", userId === 1);
        req.user = userId

        if (userId === 1 || userId === 2 || userId === 3 || userId === 4) {
            return
        }

        return reply.code(401).send({
            error: "unauthorized"
        })
        
    }) 

}

export default fp(authConfig)
