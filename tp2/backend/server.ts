import express from 'express'
import accountRouter from './routes/account.routes.js';

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use('/api', express.json())

app.use('/api', accountRouter);

app.listen(2023, function () {
  console.log('FoodGenie API -> http://localhost:2023')
})