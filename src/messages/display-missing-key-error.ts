import displayHelp from './display-help'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const displayMissingKeyError = async (): Promise<void> => {
  process.stdout.write(
    `⚠️️  Missing argument. Please provide at least 2 file paths\r\n\r\n`,
  )
  await delay(2000)
  displayHelp()
}

export { displayMissingKeyError }
export default displayMissingKeyError
