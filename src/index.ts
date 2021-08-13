import displayHelp from './messages/display-help'
import { wrongSchemaMessage } from './messages/wrong-schema-message'
import { version } from './messages/version'
import readAndValidateFiles from './read-and-validate-files'
import displayMissingKeyError from './messages/display-missing-key-error'

const flags = {
  version: ['-v', '--version'],
  help: ['-h', '--help'],
}

const main = async (args: string[]): Promise<void> => {
  if (args.some(e => flags.version.includes(e))) {
    displayHelp()
  }

  if (args.some(e => flags.version.includes(e))) {
    process.stderr.write(version)
    process.exit(1)
  }

  if (args.length < 2 || args.some(i => i === undefined || i === '')) {
    await displayMissingKeyError()
  }

  if (args.length >= 2 && args.every(i => i !== undefined && i !== '')) {
    const validatedFiles = await readAndValidateFiles(args)

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
