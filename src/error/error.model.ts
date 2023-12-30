import { HTTP_STATUS } from '~/constrants/httpStatus'
import ERROR_MESSAGES from './error.messages'

//tạo kiểu lỗi giống thiết kế ban đâu
type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any //này nghĩa ra ngoài ra muốn thêm vào gì thì thêm
  }
>
// { [key: string]:  {
//     [field: string]:{
//         msg: string
//     }
// }
//}

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  //truyền message mặc định
  constructor({ message = ERROR_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY }) //tạo lỗi có status 422
    this.errors = errors
  }
}
