import chalk from 'chalk'
import { version } from './version'

const homepage = 'https://github.com/caiobep/compare-schemas'

const title = (s: string): string => {
  return chalk.whiteBright(chalk.bold(s))
}

const helpMessage = `
${title('Usage:')}
  compare-schemas ${chalk.white('[schema source file] [schema instance file]')}

${title('Readme:')}
  ${chalk.underline(homepage + '/README.md')}

${title('Repository:')}
  ${chalk.underline(homepage)}

${title('Options:')}
  -h, --help     display instructions
  -v, --version  display the current version (${version}) and exit

${title('Examples:')}
  ${chalk.white('# Compare 2 JSON files')}
  compare-schemas ./appsettings.json ./dev.appsettings.json

  ${chalk.white('# Compare multiple json/yaml files')}
  compare-schemas ./appsettings.json ./dev.appsettings.json ./qa.appsettings.json ./prd.appsettings.yaml

`.trimStart()

const displayHelp = (): void => {
  process.stderr.write(helpMessage)
  process.exit(1)
}

export { helpMessage, displayHelp }
export default displayHelp
