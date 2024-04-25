import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

const sevenDays = 60 * 60 * 24 * 7

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return {
      transactions,
    }
  })

  app.get('/:id', async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)
    const transaction = await knex('transactions').where('id', id).first()

    return {
      transaction,
    }
  })

  app.get('/sumary', async () => {
    return await knex('transactions').sum('amount', { as: 'amount' }).first()
  })

  app.post('/', async (request, reply) => {
    const createTransactionBosySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBosySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: sevenDays,
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
