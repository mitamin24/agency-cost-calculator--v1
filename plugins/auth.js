import fp from "fastify-plugin"

async function authConfig(fastify) {
    fastify.decorateRequest('user', null)
    
    fastify.addHook('preHandler', async (req, reply) => {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return reply.code(401).send({
                error: "Unauthorized",
            })
        }

        const userId = Number(authHeader)
        // console.log("user id => =>",userId===1);
        req.user= userId

        if (userId === 1 || userId === 2 || userId === 3 || userId === 4) {
            return
        }

        return reply.code(401).send({
                error: "UNAUTHORIZED"
            })

    })

}

export default fp(authConfig)