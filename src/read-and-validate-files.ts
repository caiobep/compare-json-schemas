import { ValidatedFiles } from './messages/wrong-schema-message'
import { FileState } from './index.types'
import * as fs from 'fs/promises'
import * as GenerateSchema from 'generate-schema'
import { makeAllTreeNodesRequired } from './make-all-tree-nodes-required'
import Ajv from 'ajv-draft-04'

const ajv = new Ajv({ allErrors: true })

const readAndValidateFiles = async (
  filePaths: string[],
): Promise<ValidatedFiles[]> => {
  const namedArgs = filePaths.map((filePath, index) => ({
    filePath,
    name:
      index === 0
        ? `SCHEMA_SOURCE_FILE`
        : `INSTANCE_OF_SCHEMA_FILE_PATH_${index}`,
  }))

  const files: Set<FileState> = new Set()

  for await (const { name, filePath } of namedArgs) {
    const fileContent = await fs.readFile(filePath, { encoding: 'utf8' })
    files.add({ name, filePath, fileContent: JSON.parse(fileContent) })
  }

  const [referenceObject, ...objectInstances] = [...files]
  const schema = GenerateSchema.json(referenceObject.fileContent)
  const requiredSchema = makeAllTreeNodesRequired(schema)

  const validateJsonSchema = ajv.compile(requiredSchema)

  return objectInstances.map(e => {
    const isFileValid = validateJsonSchema(e.fileContent)
    const errors = isFileValid ? undefined : validateJsonSchema.errors

    return {
      ...e,
      filePath: e.filePath,
      isFileValid,
      errors,
    }
  }) as ValidatedFiles[]
}

export { readAndValidateFiles }
export default readAndValidateFiles
