import { FileState } from './index.types'

const tagFilePaths = (
  filePath: string,
  index: number,
): Omit<FileState, 'fileContent'> => ({
  filePath,
  name:
    index === 0
      ? `SCHEMA_SOURCE_FILE`
      : `INSTANCE_OF_SCHEMA_FILE_PATH_${index}`,
})

export { tagFilePaths }
export default tagFilePaths
