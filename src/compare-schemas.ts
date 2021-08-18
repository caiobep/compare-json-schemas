import { FileState } from './index.types'
import { ValidatedFiles } from './messages/wrong-schema-message'
import GenerateSchema from 'generate-schema'
import { makeAllTreeNodesRequired } from './make-all-tree-nodes-required'
import Ajv from 'ajv-draft-04'

const ajv = new Ajv({ allErrors: true })

function compareSchemas(
  referenceObject: FileState,
  objectInstances: FileState[],
): ValidatedFiles[] {
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

export { compareSchemas }
export default compareSchemas
