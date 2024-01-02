import { exec } from 'child_process'
import { HTTP_STATUS } from '~/constrants/httpStatus'
import { ErrorWithStatus } from '~/error/error.model'
import fs from 'fs'
import path from 'path'
import { getExePath } from './files'

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

export const getClassResult = async (
  dirPath: string,
  testPrepare: { [key: string]: { testCases: Array<string>; expectedValues: Array<string> } }
): Promise<{ [key: string]: GroupedResultItem[] }> => {
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
                      if (path.extname(subfilepath) === '.c') {
                        const executedPath = getExePath(subfilepath)
                        const student_id = path.basename(path.dirname(subfilepath))
                        const parsePath = path.parse(executedPath.compiledExeCutable)
                        const question = parsePath.name
                        const testCases = testPrepare[question].testCases
                        const expectedValues = testPrepare[question].expectedValues
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
                              const handledResult = handleResult(studentResults)
                              resolve(handledResult)
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
}

/**
 * export const getClassResult = async (
  dirPath: string,
  testCases: Array<string>,
  expectedValues: Array<string>
): Promise<{ [key: string]: GroupedResultItem[] }> => {
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
                              const handledResult = handleResult(studentResults)
                              resolve(handledResult)
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
}
 */

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
