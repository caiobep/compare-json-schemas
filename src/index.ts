import { Command, flags } from '@oclif/command'
import fs from 'fs/promises'
import GenerateSchema from 'generate-schema'
import Ajv from 'ajv-draft-04'
import { makeAllTreeNodesRequired } from './make-all-tree-nodes-required'

const ajv = new Ajv({ allErrors: true })

class CompareJsonSchemas extends Command {
  static description = 'Compare JSON files schemas'

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  }

  static args = [
    {
      name: 'schema_source_file_path',
      required: false,
      description: 'JSON file to get the schema from',
    },
    {
      name: 'instance_of_schema_file_path',
      required: false,
      description: 'JSON file to validate conformity to schema',
    },
  ]

  async run(): Promise<void> {
    const { args } = this.parse(CompareJsonSchemas)

    if (Object.values(args).some(i => i === undefined || i === '')) {
      const exitMessage = `⚠️️ Missing argument. Please provide at least 2 file paths\r\n\r\n ${this._help()}`

      process.stderr.write(exitMessage)
      process.exit(1)
      // eslint-disable-next-line no-unreachable
      return
    }

    const files: Set<{
      name: string
      filePath: string
      fileContent: Record<string, any>
    }> = new Set()

    for await (const [name, filePath] of Object.entries(args)) {
      const isFileAccessible = (await fs.stat(filePath)).isFile()
      if (!isFileAccessible) {
        throw new Error(
          `${filePath} provided as ${name.toUpperCase()} is not a valid path`,
        )
      }

      const fileContent = await fs.readFile(filePath, { encoding: 'utf8' })
      if (!fileContent) {
        throw new Error(`Could not read ${name.toUpperCase} from ${filePath}`)
      }

      files.add({ name, filePath, fileContent: JSON.parse(fileContent) })
    }

    const [referenceObject, ...objectInstances] = [...files]
    const schema = await GenerateSchema.json(referenceObject.fileContent)
    const requiredSchema = makeAllTreeNodesRequired(schema)

    const validateJsonSchema = ajv.compile(requiredSchema)

    await Promise.all(
      objectInstances.map(async e => validateJsonSchema(e.fileContent)),
    )

    if (validateJsonSchema.errors !== null) {
      process.stderr
        .write(`🚫 File schemas do not match.\r\n Details: \r\n  ${validateJsonSchema.errors
        ?.map(e => `  - ${e.message}`)
        .join('\r\n  ')}
      `)
      process.exit(1)
    }

    process.stdout.write('✅ All files schema matches')
    process.exit(0)
  }
}

export = CompareJsonSchemas
