import { exec } from 'child_process'
import { HTTP_STATUS } from '~/constrants/httpStatus';
import { ErrorWithStatus } from '~/error/error.model';

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
            message: 'File is not valid',
            status: HTTP_STATUS.BAD_REQUEST
          })
        )
      }

      const runningChildProcess = exec(`${compiledExeCutable}`, (runError, runStdout, runStderr) => {
        if (runError || runStderr) {
          return reject(
            new ErrorWithStatus({
              message: 'File is not valid',
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
        }
        const actualValue = runStdout.split('\n').pop() || ''
        console.log(runStdout)
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

export const checkFunction = async (
  testCases: Array<string>,
  expectedValues: Array<string>,
  executedPath: { compiledExeCutable: string, compileCommand: string }
): Promise<Array<{ testCase: string; actualValue: string; expectedValue: string }>> => {
  const promises = testCases.map(async (testCase) => {
    return await testFunction(testCase, executedPath)
  })
  const results = await Promise.all(promises)
  const fail: Array<{ testCase: string; actualValue: string; expectedValue: string }> = []
  results.forEach((result, index) => {
    if (result.actualValue.toLowerCase() !== expectedValues[index].toLowerCase()) {
      fail.push({ testCase: result.testCase, actualValue: result.actualValue, expectedValue: expectedValues[index] })
    }
  })
  console.log(fail)
  return fail
}
