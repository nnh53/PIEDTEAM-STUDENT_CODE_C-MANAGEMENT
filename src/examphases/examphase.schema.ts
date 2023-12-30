import { ObjectId } from 'mongodb'

interface IExamPhaseType {
  _id?: ObjectId
  exam_name: string
  exam_type: ExamPhaseType
  exam_time: Date
}

export class ExamPhaseType {
  _id: ObjectId
  exam_name: string
  exam_type: ExamPhaseType
  exam_time: Date

  constructor(examphase: IExamPhaseType) {
    this._id = new ObjectId()
    this.exam_name = examphase.exam_name
    this.exam_type = examphase.exam_type
    this.exam_time = examphase.exam_time
  }
}
