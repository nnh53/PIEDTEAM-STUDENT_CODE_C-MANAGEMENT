import { ChildProcess, exec } from 'child_process'
import e, { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_FILE_DIR } from '~/constrants/dir'
import { HTTP_STATUS } from '~/constrants/httpStatus'
import { ErrorWithStatus } from '~/error/error.model'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_FILE_DIR)) {
    fs.mkdirSync(UPLOAD_FILE_DIR, {
      recursive: true
      //Agree to create folder recursively
    })
  }
}

export const handleUploadFile = async (req: Request) => {
  //Create File will User Directly Upload
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_FILE_DIR),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 10 * 1024, // 10KB,
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

export const getExePath = (filepath: string) => {
  return new Promise<{ compiledExeCutable: string; program: ChildProcess }>((resolve, reject) => {
    const compiledExeCutable = `${getNameFromPath(filepath)}.exe`
    const compileCommand = `gcc ${filepath} -o ${compiledExeCutable}`
    const program = exec(compileCommand, async (error, stdout, stderr) => {
      if (error || stderr) {
        return reject(error || stderr)
      }
    })
    resolve({ compiledExeCutable, program })
  })
}
