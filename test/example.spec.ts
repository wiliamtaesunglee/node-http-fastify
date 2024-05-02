import { afterAll, beforeAll, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
  app.ready()
})

afterAll(async () => {
  app.close()
})

test('User can create a new transaction', async () => {
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })
    .expect(201)
})
