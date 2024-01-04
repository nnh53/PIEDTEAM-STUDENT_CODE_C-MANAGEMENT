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
      testCases: ['1\n2\n3\n', '2\n2\n3\n', '3\n2\n3\n', '3\n4\n5\n', '2\n2\n2\n', '6\n7\n8\n'],
      expectedValues: [
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nKhong phai tam giac',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac can',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac can',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac vuong',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac deu',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac thuong'
      ]
    },
    main2: {
      testCases: ['10\n'],
      expectedValues: ['Nhap so n: \r\n55']
    },
    main3: {
      testCases: ['1\n', '5\n', '7\n'],
      expectedValues: ['Nhap so n: \r\n1', 'Nhap so n: \r\n5', 'Nhap so n: \r\n13']
    },
    main4: {
      testCases: ['1\n10\n', '10\n1\n'],
      expectedValues: ['Nhap start: \r\nNhap end: \r\n4-3-5-5', 'Nhap start: \r\nNhap end: \r\n4-3-5-5']
    },
    main5: {
      testCases: ['7\n', '5\n'],
      expectedValues: ['Nhap so n: \r\n0', 'Nhap so n: \r\n1']
    },
    main6: {
      testCases: ['1234\n', '1123\n'],
      expectedValues: ['Nhap so n: \r\n10-24-4321', 'Nhap so n: \r\n7-6-3211']
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
      testCases: ['1\n2\n3\n', '2\n2\n3\n', '3\n2\n3\n', '3\n4\n5\n', '2\n2\n2\n', '6\n7\n8\n'],
      expectedValues: [
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nKhong phai tam giac',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac can',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac can',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac vuong',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac deu',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac thuong'
      ]
    },
    main2: {
      testCases: ['10\n'],
      expectedValues: ['Nhap so n: \r\n55']
    },
    main3: {
      testCases: ['1\n', '5\n', '7\n'],
      expectedValues: ['Nhap so n: \r\n1', 'Nhap so n: \r\n5', 'Nhap so n: \r\n13']
    },
    main4: {
      testCases: ['1\n10\n', '10\n1\n'],
      expectedValues: ['Nhap start: \r\nNhap end: \r\n4-3-5-5', 'Nhap start: \r\nNhap end: \r\n4-3-5-5']
    },
    main5: {
      testCases: ['7\n', '5\n'],
      expectedValues: ['Nhap so n: \r\n0', 'Nhap so n: \r\n1']
    },
    main6: {
      testCases: ['1234\n', '1123\n'],
      expectedValues: ['Nhap so n: \r\n10-24-4321', 'Nhap so n: \r\n7-6-3211']
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
  const testPrepare = {
    main1: {
      testCases: ['1\n2\n3\n', '2\n2\n3\n', '3\n2\n3\n', '3\n4\n5\n', '2\n2\n2\n', '6\n7\n8\n'],
      expectedValues: [
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nKhong phai tam giac',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac can',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac can',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac vuong',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac deu',
        'Nhap so a: \r\nNhap so b: \r\nNhap so c: \r\nTam giac thuong'
      ]
    },
    main2: {
      testCases: ['10\n'],
      expectedValues: ['Nhap so n: \r\n55']
    },
    main3: {
      testCases: ['1\n', '5\n', '7\n'],
      expectedValues: ['Nhap so n: \r\n1', 'Nhap so n: \r\n5', 'Nhap so n: \r\n13']
    },
    main4: {
      testCases: ['1\n10\n', '10\n1\n'],
      expectedValues: ['Nhap start: \r\nNhap end: \r\n4-3-5-5', 'Nhap start: \r\nNhap end: \r\n4-3-5-5']
    },
    main5: {
      testCases: ['7\n', '5\n'],
      expectedValues: ['Nhap so n: \r\n0', 'Nhap so n: \r\n1']
    },
    main6: {
      testCases: ['1234\n', '1123\n'],
      expectedValues: ['Nhap so n: \r\n10-24-4321', 'Nhap so n: \r\n7-6-3211']
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
