import MongodbDatabase from '~/database/database.mongo'

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

  async uploadImageService(req: any) {}
}

export default TestManagementsServices
