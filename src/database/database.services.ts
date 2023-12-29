import MongodbDatabase from './database.mongo'
import { Collection } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const MongoDBInstance = MongodbDatabase.getInstance()
class DatabaseServices {}

const databaseServices = new DatabaseServices()
export default databaseServices
