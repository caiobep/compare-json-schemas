import { filterNonAsciiAndWhitespace, runCli } from './test-utils'

describe('compare-json-schemas', () => {
  it('Should print help when no arguments are provided', async () => {
    const compareJsonSchemas = await runCli()

    const expectedHelpText = filterNonAsciiAndWhitespace(`
      Compare JSON files schemas

      USAGE
        $ compare-json-schemas

      OPTIONS
        -h, --help     show CLI help
        -v, --version  show CLI version
    `)

    const stdoutMessage = filterNonAsciiAndWhitespace(compareJsonSchemas.stdout)

    expect(stdoutMessage).toBe(expectedHelpText)
  })

  it('Should print help when the -h or --help flag is provided', async () => {
    const runWithHelpAlias = (await runCli('--help')).stdout
    const runWithHelpFlag = (await runCli('-h')).stdout

    const expectedHelpText = filterNonAsciiAndWhitespace(`
      Compare JSON files schemas

      USAGE
        $ compare-json-schemas

      OPTIONS
        -h, --help     show CLI help
        -v, --version  show CLI version
    `)

    expect(filterNonAsciiAndWhitespace(runWithHelpAlias)).toBe(expectedHelpText)
    expect(filterNonAsciiAndWhitespace(runWithHelpFlag)).toBe(expectedHelpText)
  })
})
