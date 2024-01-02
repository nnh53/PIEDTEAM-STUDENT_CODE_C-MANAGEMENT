import { exec } from 'child_process'
import { HTTP_STATUS } from '~/constrants/httpStatus'
import { ErrorWithStatus } from '~/error/error.model'
import fs from 'fs'
import path from 'path'
import { getExePath } from './files'
import { log } from 'console'

export const testFunction = (
  testCase: string,
  executedPath: { compiledExeCutable: string; compileCommand: string }
): Promise<{ actualValue: string; testCase: string }> => {
  const { compiledExeCutable, compileCommand } = executedPath
  return new Promise((resolve, reject) => {
    exec(compileCommand, async (error, stdout, stderr) => {
      if (error || stderr) {
        return reject(
          new ErrorWithStatus({
            message: 'Problem in building file to exe',
            status: HTTP_STATUS.BAD_REQUEST
          })
        )
      }

      const runningChildProcess = exec(`${compiledExeCutable}`, (runError, runStdout, runStderr) => {
        if (runError) {
          console.log('runError')
          console.log(runError)
          return reject(
            new ErrorWithStatus({
              message: 'Problem in executing exe file',
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }
        if (runStderr) {
          console.log('runStderr')
          console.log(runStderr)
        }
        const actualValue = handleActualValue(runStdout)
        resolve({
          actualValue,
          testCase
        }) // Resolve with the obtained result
      })

      const inputData = testCase
      runningChildProcess.stdin?.write(inputData)
      runningChildProcess.stdin?.end()
    })
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
  executedPath: { compiledExeCutable: string; compileCommand: string }
): Promise<{
  student_id: string
  question: string
  fail: Array<{ testCase: string; actualValue: string; expectedValue: string }>
}> => {
  const promises = testCases.map(async (testCase) => {
    return await testFunction(testCase, executedPath)
  })
  const parsePath = path.parse(executedPath.compiledExeCutable)
  const question = parsePath.name
  const results = await Promise.all(promises)
  const fail: Array<{ testCase: string; actualValue: string; expectedValue: string }> = []
  results.forEach((result, index) => {
    if (result.actualValue.toLowerCase() !== expectedValues[index].toLowerCase()) {
      fail.push({ testCase: result.testCase, actualValue: result.actualValue, expectedValue: expectedValues[index] })
    }
  })
  return { student_id, question, fail }
}

// export const checkFunction = async (
//   student_id: string,
//   testCases: Array<string>,
//   expectedValues: Array<string>,
//   executedPath: { compiledExeCutable: string; compileCommand: string }
// ): Promise<{ student_id: string; fail: Array<{ testCase: string; actualValue: string; expectedValue: string }> }> => {
//   const promises = testCases.map(async (testCase) => {
//     return await testFunction(testCase, executedPath)
//   })
//   const results = await Promise.allSettled(promises)
//   const fail: Array<{ testCase: string; actualValue: string; expectedValue: string }> = []
//   results.forEach((result, index) => {
//     if (result.status === 'fulfilled') {
//       const actualValue = result.value.actualValue.toLowerCase()
//       const expectedValue = expectedValues[index].toLowerCase()
//       if (actualValue !== expectedValue) {
//         fail.push({ testCase: result.value.testCase, actualValue, expectedValue })
//       }
//     } else {
//       fail.push({ testCase: testCases[index], actualValue: '', expectedValue: expectedValues[index] })
//     }
//   })
//   return { student_id, fail }
// }

export const getClassResult = async (
  dirPath: string,
  testCases: Array<string>,
  expectedValues: Array<string>
): Promise<
  Array<{
    student_id: string
    question: string
    fail: Array<{ testCase: string; actualValue: string; expectedValue: string }>
  }>
> => {
  const studentResults: Array<{
    student_id: string
    question: string
    fail: Array<{ testCase: string; actualValue: string; expectedValue: string }>
  }> = []

  return new Promise((resolve, reject) => {
    fs.promises
      .readdir(dirPath)
      .then((files) => {
        for (const file of files) {
          const filepath = path.join(dirPath, file)
          fs.promises
            .stat(filepath)
            .then((stats) => {
              if (stats.isDirectory()) {
                fs.promises
                  .readdir(filepath)
                  .then((subFiles) => {
                    const numFileC = subFiles.filter((subFile) => path.extname(subFile) === '.c').length
                    for (const subFile of subFiles) {
                      const subfilepath = path.join(filepath, subFile)
                      console.log(subfilepath)
                      if (path.extname(subfilepath) === '.c') {
                        const executedPath = getExePath(subfilepath)
                        const student_id = path.basename(path.dirname(subfilepath))
                        checkFunction(student_id, testCases, expectedValues, executedPath)
                          .then((studentResult) => {
                            studentResults.push(studentResult)
                            if (studentResults.length === files.length * numFileC) {
                              studentResults.sort((a, b) => {
                                const student_idCompare = a.student_id.localeCompare(b.student_id)
                                if (student_idCompare !== 0) {
                                  return student_idCompare
                                }
                                return a.question.localeCompare(b.question)
                              })
                              resolve(studentResults)
                            }
                          })
                          .catch((err) => {
                            reject(
                              new ErrorWithStatus({
                                message: err.message,
                                status: HTTP_STATUS.BAD_REQUEST
                              })
                            )
                          })
                      }
                    }
                  })
                  .catch((err) => {
                    reject(
                      new ErrorWithStatus({
                        message: err.message,
                        status: HTTP_STATUS.BAD_REQUEST
                      })
                    )
                  })
              }
            })
            .catch((err) => {
              reject(
                new ErrorWithStatus({
                  message: err.message,
                  status: HTTP_STATUS.BAD_REQUEST
                })
              )
            })
        }
      })
      .catch((err) => {
        reject(
          new ErrorWithStatus({
            message: err.message,
            status: HTTP_STATUS.BAD_REQUEST
          })
        )
      })
  })
  /**
   * const files = await fs.promises.readdir(dirPath)
    console.log(files)
    for (const file of files) {
      const filepath = path.join(dirPath, file)
      const stat = await fs.promises.stat(filepath)
      // console.log(stat)
      if (stat.isDirectory()) {
        console.log('isDirectory: ' + file)
        const subfiles = await fs.promises.readdir(filepath)
        console.log(subfiles)
        for (const subfile of subfiles) {
          const subfilepath = path.join(filepath, subfile)
          console.log(subfilepath)
          if (path.extname(subfilepath) === '.c') {
            const executedPath = getExePath(subfilepath)
            const student_id = path.basename(path.dirname(subfilepath))
            const studentResult = await checkFunction(student_id, testCases, expectedValues, executedPath)
            console.log(studentResult)
            studentResults.push(studentResult)
          }
        }
      }
    }
   */
}
