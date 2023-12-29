import express from 'express'
import Database from './database/database.connection'
import MongodbDatabase from './database/database.mongo'
import dotenv from 'dotenv'


dotenv.config()
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('hello world')
})

const database = Database.getInstance()
database.connect(MongodbDatabase.getInstance())

app.listen(port, () => {
  console.log(`Server is running in port: ${port}`)
})
