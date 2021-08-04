import path from 'path'
import { spawnSync, SpawnSyncReturns } from 'child_process'

export const runCli = async (
  ...args: string[]
): Promise<SpawnSyncReturns<string>> => {
  const cli = process.env.PROJECT_ROOT_DIR
    ? path.join(process.env.PROJECT_ROOT_DIR, 'bin', 'run')
    : path.join(__dirname, '..', '..', 'bin', 'run')

  return spawnSync(cli, args, {
    env: {
      ...process.env,
      NODE_ENV: 'test',
    },
    encoding: 'utf8',
  })
}

export const filterNonAsciiAndWhitespace = (str: string): string =>
  str
    .replace(/(\n)/g, '')
    .split(' ')
    .filter(e => e === ' ')
    .join()
