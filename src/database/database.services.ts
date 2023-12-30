import MongodbDatabase from './database.mongo'
import { Collection } from 'mongodb'
import dotenv from 'dotenv'
import { TestManagementType } from '~/testmanagements/testManagement.schema'
import User from '~/users/user.schema'
dotenv.config()

const MongoDBInstance = MongodbDatabase.getInstance()
class DatabaseServices {
  get users(): Collection<User> {
    return MongoDBInstance.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
  get students(): Collection<User> {
    return MongoDBInstance.db.collection(process.env.DB_STUDENTS_COLLECTION as string)
  }
  get testmanagements(): Collection<TestManagementType> {
    return MongoDBInstance.db.collection(process.env.DB_TEST_MANAGEMENTS_COLLECTION as string)
  }
  get staffs(): Collection<TestManagementType> {
    return MongoDBInstance.db.collection(process.env.DB_STAFFS_COLLECTION as string)
  }
  get examphases(): Collection<TestManagementType> {
    return MongoDBInstance.db.collection(process.env.DB_EXAMPHASES_COLLECTION as string)
  }
  get questions(): Collection<TestManagementType> {
    return MongoDBInstance.db.collection(process.env.DB_QUESTIONS_COLLECTION as string)
  }
  get testcases(): Collection<TestManagementType> {
    return MongoDBInstance.db.collection(process.env.DB_TESTCASES_COLLECTION as string)
  }
  get tests(): Collection<TestManagementType> {
    return MongoDBInstance.db.collection(process.env.DB_TESTS_COLLECTION as string)
  }
}

const databaseServices = new DatabaseServices()
export default databaseServices
