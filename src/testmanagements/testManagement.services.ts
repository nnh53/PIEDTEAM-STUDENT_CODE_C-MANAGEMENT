import { Request } from 'express'
import MongodbDatabase from '~/database/database.mongo'
import { getNameFromFullname, handleUploadImage } from '~/utils/files'

const mongodbDatabase = MongodbDatabase.getInstance()

class TestManagementsServices {
  private static instance: TestManagementsServices

  private constructor() {}

  public static getInstance(): TestManagementsServices {
    if (!TestManagementsServices.instance) {
      TestManagementsServices.instance = new TestManagementsServices()
    }
    return TestManagementsServices.instance
  }

  async uploadImageService(req: Request) {
    const file = await handleUploadImage(req)
    const filename = file.newFilename
    return {
      url: `${process.env.SERVER_HOST}/files/${filename}`
    }
  }
}

export default TestManagementsServices
