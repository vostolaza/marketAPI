import express, { Request, Response, Router } from "express";

const client = require('prom-client');
const register = client.register;

const collectDefaultMetrics = client.collectDefaultMetrics;
const Counter = client.Counter;

const c = new Counter ({
  name: 'counter_test',
  help: 'Example of a counter',
  labelNames: ['code']
})

const metricsController: Router = express.Router();

metricsController.get("/", async (req: Request, res: Response) => {
  try {
    c.inc ({code: 200});
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).send(error);
  }
});

export default metricsController;