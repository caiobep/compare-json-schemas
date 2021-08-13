import fs from 'fs/promises'
import GenerateSchema from 'generate-schema'
import Ajv from 'ajv-draft-04'
import { makeAllTreeNodesRequired } from './make-all-tree-nodes-required'
import displayHelp from './messages/display-help'
import {
  ValidatedFiles,
  wrongSchemaMessage,
} from './messages/wrong-schema-message'
import { FileState } from './index.types'
import { version } from './messages/version'

const ajv = new Ajv({ allErrors: true })

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const flags = {
  version: ['-v', '--version'],
  help: ['-h', '--help'],
}

const main = async (args: string[]): Promise<void> => {
  if (args.some(e => flags.version.includes(e))) {
    process.stderr.write(version)
    process.exit(1)
  }

  if (args.length < 2 || args.some(i => i === undefined || i === '')) {
    const missingKeyMessage = `⚠️️  Missing argument. Please provide at least 2 file paths\r\n\r\n`

    process.stdout.write(missingKeyMessage)
    await delay(2000)
  }

  if (args.length >= 2 && args.every(i => i !== undefined && i !== '')) {
    const namedArgs = args.map((filePath, index) => ({
      filePath,
      name:
        index === 0
          ? `SCHEMA_SOURCE_FILE`
          : `INSTANCE_OF_SCHEMA_FILE_PATH_${index}`,
    }))

    const files: Set<FileState> = new Set()

    for await (const { name, filePath } of namedArgs) {
      try {
        const fileContent = await fs.readFile(filePath, { encoding: 'utf8' })
        files.add({ name, filePath, fileContent: JSON.parse(fileContent) })
      } catch (error) {
        throw new Error(`Could Not access file. Details ${error}\r\n`)
      }
    }

    const [referenceObject, ...objectInstances] = [...files]
    const schema = GenerateSchema.json(referenceObject.fileContent)
    const requiredSchema = makeAllTreeNodesRequired(schema)

    const validateJsonSchema = ajv.compile(requiredSchema)

    const validatedFiles = objectInstances.map(e => {
      const isFileValid = validateJsonSchema(e.fileContent)
      const errors = isFileValid ? undefined : validateJsonSchema.errors

      return {
        ...e,
        filePath: e.filePath,
        isFileValid,
        errors,
      }
    }) as ValidatedFiles[]

    if (validatedFiles.some(s => !s.isFileValid)) {
      const errorMessage = wrongSchemaMessage(validatedFiles)
      process.stderr.write(errorMessage)
      process.exit(1)
    }

    process.stdout.write('✅ All files schema matches \r\n')
    process.exit(0)
  }

  displayHelp()
}

export { main }
export default main
