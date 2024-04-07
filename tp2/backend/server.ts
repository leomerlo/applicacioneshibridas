import express from 'express'
import accountRouter from './routes/account.routes.js';
import profileRouter from './routes/profile.routes.js';
import plansRouter from './routes/plans.routes.js';
import recipiesRouter from './routes/recipies.routes.js';
import patientsRouter from './routes/patients.routes.js';
import backofficeRouter from './routes/backoffice.routes.js';
import subscribeRouter from './routes/subscription.routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { Router } from 'express';

dotenv.config();

const app = express()
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use('/api', express.json())

app.use('/api', accountRouter);
app.use('/api', profileRouter);
app.use('/api', plansRouter);
app.use('/api', recipiesRouter);
app.use('/api', patientsRouter);
app.use('/api', subscribeRouter);
app.use('/api/admin', backofficeRouter);

const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log(`FoodGenie API running on port ${port}!`)
});
