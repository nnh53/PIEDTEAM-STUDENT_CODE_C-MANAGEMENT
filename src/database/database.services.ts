import MongodbDatabase from './database.mongo'
import { Collection } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const MongoDBInstance = MongodbDatabase.getInstance()
class DatabaseServices {
  // get users(): Collection<User> {
  //   return MongoDBInstance.db.collection(process.env.DB_USERS_COLLECTION as string)
  // }
}

const databaseServices = new DatabaseServices()
export default databaseServices
