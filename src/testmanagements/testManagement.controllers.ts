import { Request, Response } from 'express'
import { TEST_MANAGEMENT_MESSAGES } from './testManagement.messages'
import TestManagementsServices from './testManagement.services'
import { getClassResult } from '~/utils/test'
import { UPLOAD_FILE_DIR } from '~/constrants/dir'
import { ErrorWithStatus } from '~/error/error.model'

const testManagementsServicesInstance = TestManagementsServices.getInstance()

export const getStudentResultController = async (req: Request, res: Response) => {
  const { id } = req.params
  const testPrepare = {
    main1: {
      testCases: ['1234\n'],
      expectedValues: ['Nhap so n: \r\n10']
    },
    main2: {
      testCases: ['6\n'],
      expectedValues: ['Nhap so n: \r\n8']
    },
    main3: {
      testCases: ['9\n', '5\n'],
      expectedValues: ['Nhap so n: \r\nKhong phai so nguyen to', 'Nhap so n: \r\nLa so nguyen to']
    },
    main4: {
      testCases: ['10\n'],
      expectedValues: ['Nhap so n: \r\n1\r\n3\r\n5\r\n7\r\n9']
    }
  }
  const classResult = await getClassResult(UPLOAD_FILE_DIR, testPrepare)
  const studentResult = classResult[id]
  return res.json({
    message: 'Class Result !',
    studentResult
  })
}

export const getClassResultController = async (req: Request, res: Response) => {
  const testPrepare = {
    main1: {
      testCases: ['1234\n'],
      expectedValues: ['Nhap so n: \r\n10']
    },
    main2: {
      testCases: ['6\n'],
      expectedValues: ['Nhap so n: \r\n8']
    },
    main3: {
      testCases: ['9\n', '5\n'],
      expectedValues: ['Nhap so n: \r\nKhong phai so nguyen to', 'Nhap so n: \r\nLa so nguyen to']
    },
    main4: {
      testCases: ['10\n'],
      expectedValues: ['Nhap so n: \r\n1\r\n3\r\n5\r\n7\r\n9']
    }
  }
  const classResult = await getClassResult(UPLOAD_FILE_DIR, testPrepare)
  if (classResult === null) {
    return res.json({
      message: 'Student has not submitted yet'
    })
  }
  const classSummary = {} as { [key: string]: number }
  for (const key in classResult) {
    if (classResult[key] !== undefined) {
      const questionResult = classResult[key]
      const questionSummary = questionResult.filter((item) => item.fail.length == 0)
      classSummary[key] = questionSummary.length
    }
  }
  return res.json({
    message: 'Class Result !',
    classSummary
  })
}

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
  const testPrepare = {
    main1: {
      testCases: ['1234\n'],
      expectedValues: ['Nhap so n: \r\n10']
    },
    main2: {
      testCases: ['6\n'],
      expectedValues: ['Nhap so n: \r\n8']
    },
    main3: {
      testCases: ['9\n', '5\n'],
      expectedValues: ['Nhap so n: \r\nKhong phai so nguyen to', 'Nhap so n: \r\nLa so nguyen to']
    },
    main4: {
      testCases: ['10\n'],
      expectedValues: ['Nhap so n: \r\n1\r\n3\r\n5\r\n7\r\n9']
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
  // return res.json({
  //   message: TEST_MANAGEMENT_MESSAGES.UPLOAD_FILE_SUCCESS,
  //   result: file
  // })
}
