import express from 'express'
import accountRouter from './routes/account.routes.js';
import profileRouter from './routes/profile.routes.js';
import plansRouter from './routes/plans.routes.js';
import recipiesRouter from './routes/recipies.routes.js';
import cors from 'cors';

const app = express()
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use('/api', express.json())

app.use('/api', accountRouter);
app.use('/api', profileRouter);
app.use('/api', plansRouter);
app.use('/api', recipiesRouter);

process.env.NODE_ENV === 'production' ? module.exports = app : app.listen(2023, function () {
  console.log('FoodGenie API -> http://localhost:2023')
});
