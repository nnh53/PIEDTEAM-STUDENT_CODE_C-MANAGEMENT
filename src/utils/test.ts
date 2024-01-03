import { ChildProcess, exec } from 'child_process'
import { HTTP_STATUS } from '~/constrants/httpStatus'
import { ErrorWithStatus } from '~/error/error.model'
import fs from 'fs'
import path from 'path'
import { getExePath } from './files'

export const testFunction = (
  testCase: string,
  exePath: string
): Promise<{ actualValue: string; testCase: string; runningChildProcess: ChildProcess }> => {
  return new Promise((resolve, reject) => {
    const runningChildProcess = exec(`${exePath}`, { maxBuffer: 1024 }, (runError, runStdout, runStderr) => {
      if (runError) {
        //console.log('runError')
        //console.log(runError)
        // return reject(
        //   new ErrorWithStatus({
        //     message: 'Problem in executing exe file',
        //     status: HTTP_STATUS.BAD_REQUEST
        //   })
        // )
        resolve({
          actualValue: `${runError?.message}`,
          testCase,
          runningChildProcess
        })
      }
      if (runStderr) {
        // console.log('runStderr')
        // console.log(runStderr)
        // resolve({
        //   actualValue: `${runStderr}`,
        //   testCase
        // })
      }
      const actualValue = handleActualValue(runStdout)
      //console.log(runStdout)
      resolve({
        actualValue,
        testCase,
        runningChildProcess
      }) // Resolve with the obtained result
    })

    const inputData = testCase
    runningChildProcess.stdin?.write(inputData)
    runningChildProcess.stdin?.end()
  })
}

const handleActualValue = (actualValue: string) => {
  const lines = actualValue.split('\n')
  lines.shift()
  return lines.join('\n')
}

export const checkFunction = async (
  student_id: string,
  testCases: Array<string>,
  expectedValues: Array<string>,
  executedPath: string
): Promise<{
  student_id: string
  question: string
  fail: Array<{ testCase: string; actualValue: string; expectedValue: string }>
}> => {
  const promises = testCases.map(async (testCase) => {
    return await testFunction(testCase, executedPath)
  })
  const parsePath = path.parse(executedPath)
  const question = parsePath.name
  const results = await Promise.all(promises)
  const fail: Array<{ testCase: string; actualValue: string; expectedValue: string }> = []
  results.forEach((result, index) => {
    if (result.actualValue.toLowerCase() !== expectedValues[index].toLowerCase()) {
      fail.push({ testCase: result.testCase, actualValue: result.actualValue, expectedValue: expectedValues[index] })
    }
    result.runningChildProcess.kill()
  })
  return { student_id, question, fail }
}

// export const getClassResult = async (
//   dirPath: string,
//   testPrepare: { [key: string]: { testCases: Array<string>; expectedValues: Array<string> } }
// ): Promise<{ [key: string]: GroupedResultItem[] }> => {
//   const studentResults: Array<{
//     student_id: string
//     question: string
//     fail: Array<{ testCase: string; actualValue: string; expectedValue: string }>
//   }> = []

//   return new Promise((resolve, reject) => {
//     fs.promises
//       .readdir(dirPath)
//       .then((files) => {
//         //Duyệt Forder bên trong Forder Files
//         for (const file of files) {
//           const filepath = path.join(dirPath, file)
//           fs.promises
//             .stat(filepath)
//             .then((stats) => {
//               if (stats.isDirectory()) {
//                 fs.promises
//                   .readdir(filepath)
//                   .then((subFiles) => {
//                     const numFileC = subFiles.filter((subFile) => path.extname(subFile) === '.exe').length
//                     //Duyệt các file bên trong Forder Student
//                     for (const subFile of subFiles) {
//                       const subfilepath = path.join(filepath, subFile)
//                       if (path.extname(subfilepath) === '.c') {
//                         getExePath(subfilepath).then((exePath) => {
//                           const student_id = path.basename(path.dirname(subfilepath))
//                           const parsePath = path.parse(exePath)
//                           const question = parsePath.name
//                           const testCases = testPrepare[question].testCases
//                           const expectedValues = testPrepare[question].expectedValues
//                           checkFunction(student_id, testCases, expectedValues, exePath)
//                             .then((studentResult) => {
//                               studentResults.push(studentResult)
//                               if (studentResults.length === files.length * numFileC) {
//                                 studentResults.sort((a, b) => {
//                                   const student_idCompare = a.student_id.localeCompare(b.student_id)
//                                   if (student_idCompare !== 0) {
//                                     return student_idCompare
//                                   }
//                                   return a.question.localeCompare(b.question)
//                                 })
//                                 const handledResult = handleResult(studentResults)
//                                 resolve(handledResult)
//                               }
//                             })
//                             .catch((err) => {
//                               reject(
//                                 new ErrorWithStatus({
//                                   message: err.message,
//                                   status: HTTP_STATUS.BAD_REQUEST
//                                 })
//                               )
//                             })
//                         })
//                       }
//                     }
//                   })
//                   .catch((err) => {
//                     reject(
//                       new ErrorWithStatus({
//                         message: err.message,
//                         status: HTTP_STATUS.BAD_REQUEST
//                       })
//                     )
//                   })
//               }
//             })
//             .catch((err) => {
//               reject(
//                 new ErrorWithStatus({
//                   message: err.message,
//                   status: HTTP_STATUS.BAD_REQUEST
//                 })
//               )
//             })
//         }
//       })
//       .catch((err) => {
//         reject(
//           new ErrorWithStatus({
//             message: err.message,
//             status: HTTP_STATUS.BAD_REQUEST
//           })
//         )
//       })
//   })
// }

export const getClassResult = async (
  dirPath: string,
  testPrepare: { [key: string]: { testCases: Array<string>; expectedValues: Array<string> } }
): Promise<{ [key: string]: GroupedResultItem[] }> => {
  const studentResults: Array<{
    student_id: string
    question: string
    fail: Array<{ testCase: string; actualValue: string; expectedValue: string }>
  }> = []

  try {
    const files = await fs.promises.readdir(dirPath)

    for (const file of files) {
      const filepath = path.join(dirPath, file)
      const stats = await fs.promises.stat(filepath)

      if (stats.isDirectory()) {
        const subFiles = await fs.promises.readdir(filepath)
        const numFileC = subFiles.filter((subFile) => path.extname(subFile) === '.c').length

        for (const subFile of subFiles) {
          const subfilepath = path.join(filepath, subFile)

          if (path.extname(subfilepath) === '.c') {
            try {
              const { compiledExeCutable, program } = await getExePath(subfilepath)
              const student_id = path.basename(path.dirname(subfilepath))
              const parsePath = path.parse(compiledExeCutable)
              const question = parsePath.name
              const testCases = testPrepare[question].testCases
              const expectedValues = testPrepare[question].expectedValues

              const studentResult = await checkFunction(student_id, testCases, expectedValues, compiledExeCutable)
              studentResults.push(studentResult)
              program.kill()
              //console.log(program.killed)
            } catch (err) {
              // Handle errors for individual student files
              console.error('Error processing student file:', err)
            }
          }
        }
      }
    }

    // Process all files, even if some failed, and return the results
    const handledResult = handleResult(studentResults)
    return handledResult
  } catch (err) {
    console.error('Error reading directory:', err)
    throw new ErrorWithStatus({
      message: 'Problem in reading base directory',
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

interface GroupedResultItem {
  question: string
  fail: Array<{
    testCase: string
    actualValue: string
    expectedValue: string
  }>
}

const handleResult = (
  results: Array<{
    student_id: string
    question: string
    fail: Array<{ testCase: string; actualValue: string; expectedValue: string }>
  }>
) => {
  const groupedResults: { [key: string]: GroupedResultItem[] } = results.reduce(
    (acc, cur) => {
      const { student_id, question, fail } = cur

      if (!acc[student_id]) {
        acc[student_id] = []
      }

      const studentQuestions = acc[student_id]
      const existingQuestion = studentQuestions.find((q) => q.question === question)

      if (existingQuestion) {
        existingQuestion.fail.push(...fail)
      } else {
        acc[student_id].push({ question, fail })
      }

      return acc
    },
    {} as { [key: string]: GroupedResultItem[] }
  )

  return groupedResults
}
