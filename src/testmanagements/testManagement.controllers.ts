import { NextFunction, Request, Response } from 'express'
import { TEST_MANAGEMENT_MESSAGES } from './testManagement.messages'
import TestManagementsServices from './testManagement.services'
import { buileFileToExe } from '~/utils/files'
import { compareTest } from '~/utils/testCompare'

const testManagementsServicesInstance = TestManagementsServices.getInstance()

export const uploadFileController = async (req: Request, res: Response) => {
  //const url = await mediasServicesInstance.uploadImageService(req)
  //const form = formidable({})
  const file = await testManagementsServicesInstance.uploadImageService(req)
  const actualValue = await buileFileToExe(file.path)
  const expectedValue = '54321 - 15 - 120'
  console.log('actualValue ' + actualValue)
  console.log('expectedValue ' + expectedValue)
  if (actualValue !== undefined) {
    //const result = compareTest({ actualValue, expectedValue: '54321 - 15 - 120' })
    if (actualValue === expectedValue) {
      return res.json({
        message: "Student's answer is correct"
      })
    }
    return res.json({
      message: "Student's answer is incorrect"
    })
  }
  return res.json({
    message: 'Student has not submitted yet'
  })
  // return res.json({
  //   message: TEST_MANAGEMENT_MESSAGES.UPLOAD_FILE_SUCCESS,
  //   result: file
  // })
}
