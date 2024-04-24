import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'
import { env } from '../env'

const app = fastify()
app.get('/hello', async () => {
  const transaction = await knex('transactions').insert(
    {
      id: crypto.randomUUID(),
      title: 'Test Transaction',
      amount: 1000,
    },
    '*',
  )

  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Http Server Running on: ${env.PORT}`)
  })
