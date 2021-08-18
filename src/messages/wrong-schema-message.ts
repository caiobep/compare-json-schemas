import chalk from 'chalk'
import { FileState } from '../index.types'

export interface ErrorObject<
  K extends string = string,
  P = Record<string, any>,
  S = unknown,
> {
  keyword: K
  instancePath: string
  schemaPath: string
  params: P
  propertyName?: string
  message?: string
  schema?: S
  parentSchema?: Record<string, unknown>
  data?: unknown
}

export interface ValidFile extends FileState {
  isFileValid: true
  errors: null | undefined
}
export interface InvalidFile extends FileState {
  isFileValid: false
  errors: ErrorObject[] | Array<{ message: string }>
}

export type ValidatedFiles = ValidFile | InvalidFile

const wrongSchemaMessage = (e: ValidatedFiles[]): string => {
  const schemaErrorsMessage = (e as InvalidFile[])
    .filter(s => !s.isFileValid)
    .map(s => {
      const messages = s.errors
        .map(r => {
          const [msg, missingKey] = (r.message as string).split("'")

          return ` - ${chalk.white(msg)}'${chalk.red(missingKey)}'`
        })
        .join(`\r\n `)

      return `\r\n \r\nFile:\r\n  ${chalk.white(
        s.filePath,
      )}\r\n Errors: \r\n ${messages} `
    })

  return `🚫 File schemas do not match. Details: ${schemaErrorsMessage} `
}

export { wrongSchemaMessage }
export default wrongSchemaMessage
