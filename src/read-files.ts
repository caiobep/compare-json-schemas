import { FileState } from './index.types'
import fs from 'fs/promises'
import yaml from 'yaml'

async function readFiles(
  filePathsWithName: { filePath: string; name: string }[],
): Promise<FileState[]> {
  const filePaths: Set<FileState> = new Set()

  for await (const { name, filePath } of filePathsWithName) {
    try {
      const file = await fs.readFile(filePath, { encoding: 'utf8' })
      const fileContent = yaml.parse(file)

      filePaths.add({ name, filePath, fileContent })
    } catch (error) {
      throw new Error(`Could Not access file. Details ${error}\r\n`)
    }
  }

  return [...filePaths]
}

export { readFiles }
export default readFiles
