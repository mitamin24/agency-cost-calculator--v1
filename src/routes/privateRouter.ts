import type { FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { createRequire } from "module";
const require = createRequire(import.meta.url); 

type LoginBody = {
    password:string
}

type costHistoryItem = {
    
    effectiveDate: string,
    baseSalary: number,
    benefitsPercent: number,
    overheadMultiplier: number

}

type Employee = {
    id: string,
    name: string,
    role: string,
    department?: string,
    costHistory?: costHistoryItem[]
}


type LoginResponse = {
    message: string,
    employee: Employee
}

const employeesData = require("../data/employees.json") as { employees: Employee[] };

const LoginSchema: FastifySchema = {
    
    body: {
        type: 'object',
        required: ["password"],
        additionalProperties: false,
        properties: {
            password: {type: 'string', minLength: 6, maxLength: 60 }
        }
    },
    response: {
        200: {
            type: 'object',
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
                            required:["effectiveDate", "baseSalary", "benefitsPercent", "overheadMultiplier"],
                            additionalProperties: false,
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

export default async function privateRoutes (fastify: FastifyInstance) {
    fastify.post<{
        Body: LoginBody
        Reply: LoginResponse
    }>('/login', {schema: LoginSchema}, async (req:FastifyRequest, reply:FastifyReply) => {

        const data = employeesData.employees.find( e => Number(e.id) ===  req.user)
        
        if (!data) {
            return reply.code(404).send({
                message: "employee not found"
            })
        }

        console.log("=> => =>", data);
        return reply.code(200).send({
            messsage: "successfully logged in",
            employee: data
        })

    })

}