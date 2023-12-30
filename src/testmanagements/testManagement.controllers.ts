import { Request, Response } from 'express'
import { TEST_MANAGEMENT_MESSAGES } from './testManagement.messages'
import TestManagementsServices from './testManagement.services'
import { buileFileToExe } from '~/utils/files'
import { checkFunction, testFunction } from '~/utils/test'

const testManagementsServicesInstance = TestManagementsServices.getInstance()

export const uploadFileController = async (req: Request, res: Response) => {
  const file = await testManagementsServicesInstance.uploadImageService(req)
  const executedPath = buileFileToExe(file.path)
  const testCases = ['3\n3\n3\n', '4\n5\n6\n', '3\n4\n5\n']
  const expectedValues = ['Tam giac thuong', 'Tam giac thuong', 'Tam giac can']
  const testFails = await checkFunction(testCases, expectedValues, executedPath)
  if (file) {
    if (testFails.length === 0) {
      return res.json({
        message: "Student's answer is correct"
      })
    } else {
      return res.json({
        message: "Student's answer is incorrect",
        testFails
      })
    }
  }
  return res.json({
    message: 'Student has not submitted yet'
  })
  // return res.json({
  //   message: TEST_MANAGEMENT_MESSAGES.UPLOAD_FILE_SUCCESS,
  //   result: file
  // })
}
