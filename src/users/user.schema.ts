import { ObjectId } from 'mongodb'
import { UserRole, UserStatus } from './user.enums'

export interface IUserType {
  _id?: ObjectId
  username: string
  password: string
  role: UserRole
  fullname?: string
  email?: string
  phone_number?: string
  created_at?: Date
  updated_at?: Date
  date_of_birth?: DateOfBirthType
  email_verify_token?: string
  forgot_password_token?: string
  status?: UserStatus
  bio?: string
  avatar_url?: string
  facebook_url?: string
  github_url?: string
}

type DateOfBirthType = Date | string

export default class User {
  _id?: ObjectId
  username: string
  password: string
  role: UserRole
  fullname: string
  email: string
  phone_number: string
  created_at: Date
  updated_at: Date
  date_of_birth: DateOfBirthType
  email_verify_token: string
  forgot_password_token: string
  status: UserStatus
  bio: string
  avatar_url: string
  facebook_url: string
  github_url: string

  constructor(user: IUserType) {
    const date = new Date()
    this._id = user._id || new ObjectId()
    this.username = user.username
    this.password = user.password
    this.role = user.role || UserRole.Student
    this.fullname = user.fullname || ''
    this.email = user.email || ''
    this.phone_number = user.phone_number || ''
    this.date_of_birth = user.date_of_birth || ''
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.status = user.status || UserStatus.Unverified
    this.bio = user.bio || ''
    this.avatar_url = user.avatar_url || ''
    this.facebook_url = user.facebook_url || ''
    this.github_url = user.github_url || ''
  }
}
