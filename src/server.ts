import { app } from './app'
import { env } from '../env'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Http Server Running on: ${env.PORT}`)
  })
