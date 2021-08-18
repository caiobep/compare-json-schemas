import { displayHelp, version, wrongSchemaMessage } from './messages'
import { compareSchemas } from './compare-schemas'
import { readFiles } from './read-files'
import { tagFilePaths } from './tag-file-paths'

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
    await delay(500)
  }

  if (args.length >= 2 && args.every(i => i !== undefined && i !== '')) {
    const filePathWithNames = [...new Set(args)].map(tagFilePaths)

    const [referenceObject, ...objectInstances] = await readFiles(
      filePathWithNames,
    )
    const validatedFiles = compareSchemas(referenceObject, objectInstances)

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
