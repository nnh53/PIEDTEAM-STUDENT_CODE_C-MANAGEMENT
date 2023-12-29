import { ObjectId } from 'mongodb'

interface ITestManagementType {
  _id?: ObjectId
  test_id: ObjectId
  question_id: ObjectId
  file_path?: string
  is_correct: boolean
}

export class TestManagementType {
  _id: ObjectId
  test_id: ObjectId
  question_id: ObjectId
  file_path: string
  is_correct: boolean

  constructor(testManagement: ITestManagementType) {
    this._id = new ObjectId()
    this.test_id = testManagement.test_id
    this.question_id = testManagement.question_id
    this.file_path = ''
    this.is_correct = testManagement.is_correct
  }
}
