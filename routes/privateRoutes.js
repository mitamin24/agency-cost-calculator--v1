import employeesData from "../src/data/employees.json" assert { type: "json" };


export default async function privateRoutes(fastify) {
    
    fastify.post('/login', {
        schema: {
            body: {
                type: "object",
                required: ['email', 'password'],
                properties: {
                    // id: {type: 'number'},
                    password: {type: 'string', minLength: 6, maxLength: 60 }
                }
            }, 
            response: {
                200: {
                    type: "object",
                    required: ['message', 'employee'],
                    additionalProperties: false,
                    properties: {
                        message: {type: 'string'},
                        employee: {
                            type: 'object',
                            required: ['id', 'name', 'role'],
                            additionalProperties: false,
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                role: { type: 'string' },
                                department: { type: 'string' },
                                costHistory: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            effectiveDate: { type: 'string' },
                                            baseSalary: { type: 'number' },
                                            benefitsPercent: { type: 'number' },
                                            overheadMultiplier: { type: 'number' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        // console.log(" => =>",req.user);
        // Use == because req.user is a number but json IDs are strings
        const data = employeesData.employees.find(e => Number( e.id) === req.user)
        // console.log(1 == 1);
        
        
        if (!data) {
            return reply.code(404).send({
                message: "Employee not found",
                // We don't send employee here, but we need to match schema or change schema.
                // Better approach: simply fail if user is valid but data is missing.
            })
        }

            console.log("=> => =>",data);        
        return reply.code(200).send({
            message: "successfully logged in!",
            employee: data
        })
    })

}