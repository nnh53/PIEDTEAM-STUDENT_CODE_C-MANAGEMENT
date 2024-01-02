import { Request, Response } from 'express'
import { TEST_MANAGEMENT_MESSAGES } from './testManagement.messages'
import TestManagementsServices from './testManagement.services'
import { getClassResult } from '~/utils/test'
import { UPLOAD_FILE_DIR } from '~/constrants/dir'
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
    const testPrepare = {
      main1: {
        testCases: ['10a\n100\n', '1234\n'],
        expectedValues: ['Nhap n di cu: \r\nNhap n di cu: \r\n1', 'Nhap n di cu: \r\n10']
      },
      main2: {
        testCases: ['10a\n1\n', '6\n'],
        expectedValues: ['Nhap n di cu: \r\nNhap n di cu: \r\n1', 'Nhap n di cu: \r\n8']
      },
      main3: {
        testCases: ['10a\n1\n', '9\n', '5/n'],
        expectedValues: [
          'Nhap n di cu: \r\nNhap n di cu: \r\n1',
          'Nhap n di cu: \r\nLa so nguyen to',
          'Nhap n di cu: \r\nnKhong phai so nguyen to'
        ]
      },
      main4: {
        testCases: ['10a\n1\n', '10\n'],
        expectedValues: ['Nhap n di cu: \r\nNhap n di cu: \r\n1', 'Nhap n di cu: \r\n1\n3\n5\n7\n9']
      }
    }
    const classResult = await getClassResult(UPLOAD_FILE_DIR, testPrepare)
    if (classResult === null) {
      return res.json({
        message: 'Student has not submitted yet'
      })
    }
    return res.json({
      message: 'Class Result !',
      classResult
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
