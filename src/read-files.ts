import { FileState } from './index.types'
import fs from 'fs/promises'

async function readFiles(
  filePathsWithName: { filePath: string; name: string }[],
): Promise<FileState[]> {
  const filePaths: Set<FileState> = new Set()

  for await (const { name, filePath } of filePathsWithName) {
    try {
      const fileContent = await fs.readFile(filePath, { encoding: 'utf8' })
      filePaths.add({ name, filePath, fileContent: JSON.parse(fileContent) })
    } catch (error) {
      throw new Error(`Could Not access file. Details ${error}\r\n`)
    }
  }

  return [...filePaths]
}

export { readFiles }
export default readFiles
