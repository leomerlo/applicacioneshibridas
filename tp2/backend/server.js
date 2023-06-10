import express from 'express'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use('/api', express.json())

app.listen(2023, function () {
  console.log('FoodGenie API -> http://localhost:2023')
})