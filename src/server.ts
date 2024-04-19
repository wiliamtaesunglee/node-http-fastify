import fastify from "fastify";

const app = fastify();

app.get("/hello", () => {
  return "Hello World";
});

const port = 3333;

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`Http Server Running on: ${port}`);
  });
