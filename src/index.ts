import express from 'express'
import dotenv from 'dotenv'
import { createServer } from 'http'
// import database
import Database from './database/database.connection'
import MongodbDatabase from './database/database.mongo'
// import routes
import examphaseRouter from './examphases/examphase.routes'
import questionRouter from './questions/question.routes'
import staffRouter from './staffs/staff.routes'
import studentRouter from './students/student.routes'
import testManagementRouter from './testmanagements/testManagement.routes'
import testRouter from './tests/test.routes'
import userRouter from './users/user.routes'
import testCaseRouter from './testcases/testcase.routes'
import { defaultErrorHandler } from './error/error.middlewares'
import { initFolder } from './utils/files'

// Config environment
dotenv.config()
const app = express()
const httpServer = createServer(app)
const port = process.env.SERVER_PORT
const server = process.env.SERVER_HOST

// Init folder
initFolder()

// Connect to database
const database = Database.getInstance()
database.connect(MongodbDatabase.getInstance())

// Middleware
app.use(express.json())

// Routes
app.use('/examphases', examphaseRouter)
app.use('/questions', questionRouter)
app.use('/staffs', staffRouter)
app.use('/students', studentRouter)
app.use('/testmanagements', testManagementRouter)
app.use('/tests', testRouter)
app.use('/users', userRouter)
app.use('/testcases', testCaseRouter)

app.use(defaultErrorHandler)

// Run server
httpServer.listen(port, () => {
  console.log(`Server is running in port: ${port}`)
  console.log(`${server}`)
})
