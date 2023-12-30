import { ObjectId } from 'mongodb'
import User, { IUserType } from '../users/user.schema'

interface IStaffType {
  _id?: ObjectId
  user_id: ObjectId
}
type StudentConstructorType = IStaffType & IUserType // một student là một user

export class Staff extends User {
  _id: ObjectId
  user_id: ObjectId
  constructor(staff: StudentConstructorType) {
    super(staff)
    this._id = staff._id || new ObjectId() // tự tạo id
    this.user_id = staff.user_id
  }
}
