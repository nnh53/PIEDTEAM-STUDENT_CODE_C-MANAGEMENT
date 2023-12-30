import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_FILE_DIR } from '~/constrants/dir'
import { HTTP_STATUS } from '~/constrants/httpStatus'
import { ErrorWithStatus } from '~/error/error.model'
import { exec } from 'child_process'
import { run } from 'node:test'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_FILE_DIR)) {
    fs.mkdirSync(UPLOAD_FILE_DIR, {
      recursive: true
      //Agree to create folder recursively
    })
  }
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_FILE_DIR),
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 5 * 1024, // 5KB,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'file' && Boolean(mimetype?.includes('text/x-c'))
      if (!valid) {
        form.emit(
          'error' as any,
          new ErrorWithStatus({
            message: 'File is not valid',
            status: HTTP_STATUS.BAD_REQUEST
          }) as any
        )
      }
      return valid
    }
  })
  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.file) {
        return reject(
          new ErrorWithStatus({
            message: 'File is empty',
            status: HTTP_STATUS.BAD_REQUEST
          })
        )
      }
      return resolve(files.file[0] as File)
    })
  })
}

const getNameFromPath = (filepath: string) => {
  const pathArr = filepath.split('.')
  pathArr.pop()
  return pathArr.join('.')
}

export const readCFile = (filepath: string) => {
  fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) {
      throw new ErrorWithStatus({
        message: 'File is not valid',
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    //do something with data
  })
}

export const buileFileToExe = (filepath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const compiledExeCutable = `${getNameFromPath(filepath)}.exe`
    const compileCommand = `gcc ${filepath} -o ${compiledExeCutable}`

    const childProcess = exec(compileCommand, async (error, stdout, stderr) => {
      if (error || stderr) {
        reject(
          new ErrorWithStatus({
            message: 'File is not valid',
            status: HTTP_STATUS.BAD_REQUEST
          })
        )
        return
      }

      const runningChildProcess = exec(`${compiledExeCutable}`, (runError, runStdout, runStderr) => {
        if (runError || runStderr) {
          reject(
            new ErrorWithStatus({
              message: 'File is not valid',
              status: HTTP_STATUS.BAD_REQUEST
            })
          )
          return
        }
        const result = runStdout.split('\n')[2]
        resolve(result) // Resolve with the obtained result
      })

      const inputData = '12345\n'
      runningChildProcess.stdin?.write(inputData)
      runningChildProcess.stdin?.end()
    })
  })
}
