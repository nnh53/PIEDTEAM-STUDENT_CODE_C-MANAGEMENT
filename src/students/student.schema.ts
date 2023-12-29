import { ObjectId } from 'mongodb'
import { StudentLearningStatus } from './student.enums'
import User, { IUserType } from '../users/user.schema'

interface IStudentType {
  _id?: ObjectId
  user_id: ObjectId
  health_point?: number
  learning_course: ObjectId
  completed_course_list?: ObjectId[]
  fpt_semester: string
  learning_status: StudentLearningStatus
  start_online_at?: Date
  end_online_at?: Date
  ranking?: number
}
type StudentConstructorType = IStudentType & IUserType // một student là một user

export class Student extends User {
  _id: ObjectId
  user_id: ObjectId
  fpt_semester: string
  completed_course_list: ObjectId[]
  health_point: number
  ranking: number
  learning_status: StudentLearningStatus
  learning_course: ObjectId
  start_online_at: Date
  end_online_at: Date
  constructor(student: StudentConstructorType) {
    super(student)
    const date = new Date()
    this._id = student._id || new ObjectId() // tự tạo id
    this.user_id = student.user_id
    this.fpt_semester = student.fpt_semester || ''
    this.completed_course_list = []
    this.health_point = 100
    this.ranking = 0
    this.learning_status = student.learning_status
    this.learning_course = student.learning_course
    this.start_online_at = date
    this.end_online_at = date
  }
}
