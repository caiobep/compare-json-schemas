import cli from '.'
import fs from 'fs/promises'

jest.mock('fs/promises', () => ({
  stat: jest.fn(() => ({
    isFile: () => true,
  })),
  readFile: jest.fn(),
}))

const sendPromiseAsString = <T>(e: T): Promise<string> =>
  Promise.resolve(JSON.stringify(e))

const processExitCode = jest.spyOn(process, 'exit').mockImplementation()

const processStdoutMessage = jest
  .spyOn(process.stdout, 'write')
  .mockImplementation()

const processStdErrMessage = jest
  .spyOn(process.stderr, 'write')
  .mockImplementation()

const helpMessage = jest
  .spyOn(cli.prototype, '_help' as any)
  .mockReturnValue('help text')

describe('compare-json-schemas', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should print help when not enough arguments are provided', async () => {
    await cli.run([])

    expect(helpMessage).toHaveBeenCalled()
    expect(processStdErrMessage).toHaveBeenCalledWith(
      expect.stringContaining(
        'Missing argument. Please provide at least 2 file paths',
      ),
    )
    expect(processExitCode).toHaveBeenCalledWith(1)
  })

  it('Should print missing keys from json files when paths for 2 valid json files are provided', async () => {
    const fsReadFile = jest
      .spyOn(fs, 'readFile')
      .mockReturnValue(sendPromiseAsString({ example: true }))

    await cli.run(['./fake-file1.json', './fake-file2.json'])

    expect(fsReadFile).toHaveBeenCalledWith('./fake-file1.json', {
      encoding: 'utf8',
    })
    expect(fsReadFile).toHaveBeenCalledWith('./fake-file2.json', {
      encoding: 'utf8',
    })
    expect(processExitCode).toHaveBeenCalledWith(0)
    expect(processStdoutMessage).toHaveBeenNthCalledWith(
      1,
      '✅ All files schema matches',
    )
  })

  it('Should indicate the missing keys on json file', async () => {
    const schemaSource = {
      name: 'Ada Lovelace',
      dateOfBirth: 'December 10, 1815',
    }

    const schemaInstance = {
      name: 'Charles Babage',
    }

    jest
      .spyOn(fs, 'readFile')
      .mockReturnValueOnce(sendPromiseAsString(schemaSource))
      .mockReturnValueOnce(sendPromiseAsString(schemaInstance))

    await cli.run(['./fake-file1.json', './fake-file2.json'])

    expect(processStdErrMessage).toHaveBeenCalledWith(
      expect.stringContaining('dateOfBirth'),
    )
    expect(processExitCode).toHaveBeenCalledWith(1)
  })

  it('Should print missing nested object keys', async () => {
    const schemaSource = {
      name: 'Doug Engelbart',
      achievements: {
        projects: ['mouse'],
        awards: ['Turing Award', 'MORE'],
        education: {
          college: 'Berkely',
        },
      },
    }

    const schemaInstance = {
      name: 'Alan Kay',
      achievements: {
        projects: ['Smalltalk'],
      },
    }

    jest
      .spyOn(fs, 'readFile')
      .mockReturnValueOnce(sendPromiseAsString(schemaSource))
      .mockReturnValueOnce(sendPromiseAsString(schemaInstance))

    await cli.run(['./fake-file1.json', './fake-file2.json'])

    expect(processStdErrMessage).toHaveBeenCalledWith(
      expect.stringContaining('awards'),
    )
    expect(processStdErrMessage).toHaveBeenCalledWith(
      expect.stringContaining('education'),
    )
    expect(processExitCode).toHaveBeenCalledWith(1)
  })
})
