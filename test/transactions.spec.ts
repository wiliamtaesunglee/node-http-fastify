import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', async () => {
  const server = await request(app.server)
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
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

    const list = await server.get('/transactions').set('Cookie', cookie)

    expect(list.body.transactions.length).toBeGreaterThan(0)
    delete transaction.type
    expect(list.body.transactions).toEqual([
      expect.objectContaining(transaction),
    ])
  })
})
