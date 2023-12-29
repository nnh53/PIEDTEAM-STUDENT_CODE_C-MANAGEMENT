import { ObjectId } from 'mongodb'

interface ITestType {
  _id?: ObjectId
  examphase_id: ObjectId
  test_date: Date
  test_time?: number
  test_name: string
  created_at: Date
}

export class Test {
  _id: ObjectId
  examphase_id: ObjectId
  test_date: Date
  test_time: number
  test_name: string
  created_at: Date

  constructor(test: ITestType) {
    this._id = new ObjectId()
    this.test_name = test.test_name
    this.created_at = new Date()
    this.examphase_id = test.examphase_id
    this.test_date = test.test_date
    this.test_time = 0
  }
}
