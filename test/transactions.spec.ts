import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Transactions routes', async () => {
  const server = request(app.server)
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should be possible to create a new transaction', async () => {
    await server
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('Should create a cookie on create new transaction', async () => {
    const response = await server.post('/transactions').send({
      title: 'New transaction',
      amount: 4500,
      type: 'credit',
    })

    expect(response.get('Set-Cookie')).not.toBeNull()
  })

  it('Should list all transactions', async () => {
    const transaction = {
      title: 'New transaction',
      amount: 4500,
      type: 'credit',
    }

    const response = await server.post('/transactions').send(transaction)

    const cookie = response.get('Set-Cookie')

    const list = await server.get('/transactions').set('Cookie', cookie!)

    expect(list.body.transactions.length).toBeGreaterThan(0)
    expect(list.body.transactions).toEqual([
      expect.objectContaining({
        title: transaction.title,
        amount: transaction.amount,
      }),
    ])
  })

  it('Should be able to get a specific transaction', async () => {
    const transaction = {
      title: 'New transaction',
      amount: 4500,
      type: 'credit',
    }

    const response = await server.post('/transactions').send(transaction)

    const cookie = response.get('Set-Cookie')

    const list = await server.get('/transactions').set('Cookie', cookie!)

    const transactionId = list.body.transactions[0].id

    const transactionById = await server
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookie as string[])
      .expect(200)

    expect(transactionById.body.transaction).toEqual(
      expect.objectContaining({
        title: transaction.title,
        amount: transaction.amount,
      }),
    )
  })
})
