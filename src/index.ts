import { Command, flags } from '@oclif/command'

class CompareJsonSchemas extends Command {
  static description = 'Compare JSON files schemas'

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  }

  static args = []

  async run(): Promise<void> {
    process.stdout.write(this._help())
  }
}

export = CompareJsonSchemas
