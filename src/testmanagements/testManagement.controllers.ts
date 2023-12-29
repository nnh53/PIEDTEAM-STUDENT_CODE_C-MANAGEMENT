import { Request, Response } from 'express'
import { TEST_MANAGEMENT_MESSAGES } from './testManagement.messages'
import TestManagementsServices from './testManagement.services'

const mediasServicesInstance = TestManagementsServices.getInstance()

export const uploadFileController = async (req: Request, res: Response) => {
  const url = await mediasServicesInstance.uploadImageService(req)
  return res.json({
    message: TEST_MANAGEMENT_MESSAGES.UPLOAD_FILE_SUCCESS,
    result: url
  })
}
