import { ChildProcess, exec } from 'child_process'
import { HTTP_STATUS } from '~/constraints/httpStatus'
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
        resolve({
          actualValue: `${runError?.message}`,
          testCase,
          runningChildProcess
        })
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

    setTimeout(() => {
      runningChildProcess.kill()
      resolve({
        actualValue: 'Time limit exceeded',
        testCase,
        runningChildProcess
      })
    }, 300)
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
): Promise<GroupedResult> => {
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

export const getClassResult = async (
  dirPath: string,
  testPrepare: { [key: string]: { testCases: Array<string>; expectedValues: Array<string> } }
): Promise<{ [key: string]: GroupedResultItem[] }> => {
  const studentResults: GroupedResult[] = []

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
              // console.log(studentResult)
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

interface GroupedResult {
  student_id: string
  question: string
  fail: Array<{
    testCase: string
    actualValue: string
    expectedValue: string
  }>
}

const handleResult = (results: GroupedResult[]) => {
  const groupedResults: { [key: string]: GroupedResultItem[] } = results.reduce(
    (acc, cur) => {
      const { student_id, question, fail } = cur

      if (!acc[student_id]) {
        acc[student_id] = []
      }

      const studentQuestions = acc[student_id]
      const existingQuestion = studentQuestions.find((q) => q.question === question)

      if (existingQuestion) {
        //handle question with different test cases
        existingQuestion.fail.push(...fail)
      } else {
        //handle new question
        acc[student_id].push({ question, fail })
      }

      return acc
    },
    {} as { [key: string]: GroupedResultItem[] }
  )

  return groupedResults
}
