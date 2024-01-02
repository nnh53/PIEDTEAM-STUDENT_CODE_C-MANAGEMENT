import { Request, Response } from 'express'
import { TEST_MANAGEMENT_MESSAGES } from './testManagement.messages'
import TestManagementsServices from './testManagement.services'
import { getExePath } from '~/utils/files'
import { checkFunction, getClassResult } from '~/utils/test'
import { UPLOAD_FILE_DIR } from '~/constrants/dir'
import { log } from 'console'
import { ErrorWithStatus } from '~/error/error.model'

const testManagementsServicesInstance = TestManagementsServices.getInstance()

export const uploadFileController = async (req: Request, res: Response) => {
  // const file = await testManagementsServicesInstance.uploadFileService(req)
  // const executedPath = getExePath(file.path)
  // const student_id = '123'
  // const studentResult = await checkFunction(student_id, testCases, expectedValues, executedPath)
  // if (file) {
  //   if (studentResult.fail.length === 0) {
  //     return res.json({
  //       message: "Student's answer is correct"
  //     })
  //   } else {
  //     return res.json({
  //       message: "Student's answer is incorrect",
  //       studentResult
  //     })
  //   }
  // }
  try {
    const testCases = ['11\n0\n']
    const expectedValues = ['Nhap n di cu: \r\n11 - 2 - 1\r\nNhap n di cu: ']
    const classResult = await getClassResult(UPLOAD_FILE_DIR, testCases, expectedValues)
    return res.json({
      message: 'Student has not submitted yet',
      result: classResult
    })
  } catch (err) {
    throw new ErrorWithStatus({
      message: err as string, // Type assertion to specify the type of 'err' as string
      status: 400
    })
  }
  // return res.json({
  //   message: TEST_MANAGEMENT_MESSAGES.UPLOAD_FILE_SUCCESS,
  //   result: file
  // })
}
