import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    return await knex('transactions').where('amount', 1000).select('*')
  })

  app.post('/hello', async () => {
    return await knex('transactions').insert(
      {
        id: crypto.randomUUID(),
        title: 'Test Transaction',
        amount: 1000,
      },
      '*',
    )
  })
}
