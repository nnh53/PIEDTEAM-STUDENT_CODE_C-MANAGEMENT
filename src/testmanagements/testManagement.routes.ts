import { Router } from 'express'
import { wrapAsync } from '~/utils/handlers'
import { uploadFileController } from './testManagement.controllers'

const testManagementRouter = Router()

//Get all Questions of the test
testManagementRouter.get('/:testId', (req, res) => {})

//Adding File to the question
testManagementRouter.post('/addFile', wrapAsync(uploadFileController))

export default testManagementRouter
