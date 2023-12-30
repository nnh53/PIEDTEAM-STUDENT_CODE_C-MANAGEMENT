import { ObjectId } from 'mongodb'

interface IExamPhaseType {
  _id?: ObjectId
  question_title: string
  question_score: number
  question_time: number
}

export class ExamPhaseType {
  _id: ObjectId
  question_title: string
  question_score: number
  question_time: number

  constructor(examphase: IExamPhaseType) {
    this._id = new ObjectId()
    this.question_title = examphase.question_title
    this.question_score = examphase.question_score
    this.question_time = examphase.question_time
  }
}
