import { ObjectId } from 'mongodb'

interface ITestCaseType {
  _id?: ObjectId
  question_id: ObjectId
  testcases_input: Array<string | number>
  testcases_output: Array<string | number>
}

export class TestCase {
  _id: ObjectId
  question_id: ObjectId
  testcases_input: Array<string | number>
  testcases_output: Array<string | number>

  constructor(testcase: ITestCaseType) {
    this._id = new ObjectId()
    this.question_id = testcase.question_id
    this.testcases_input = testcase.testcases_input
    this.testcases_output = testcase.testcases_output
  }
}
