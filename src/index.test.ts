import cli from '.'
import fs from 'fs/promises'
import { helpMessage } from './messages'
import wrongSchemaMessage from './messages/wrong-schema-message'

jest.mock('./env', () => ({
  npmPackageVersion: undefined,
}))

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}))

const processExitCode = jest.spyOn(process, 'exit').mockImplementation(() => {
  // eslint-disable-next-line no-throw-literal
  throw 'Stop Running App'
})

const processStdoutMessage = jest
  .spyOn(process.stdout, 'write')
  .mockImplementation()

const processStdErrMessage = jest
  .spyOn(process.stderr, 'write')
  .mockImplementation()

describe('compare-json-schemas', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  it('Should print help when not enough arguments are provided', async () => {
    try {
      await cli([])
    } catch {}

    expect(processStdoutMessage).toHaveBeenCalledWith(
      expect.stringContaining(
        'Missing argument. Please provide at least 2 file paths',
      ),
    )
    expect(processStdErrMessage).toHaveBeenCalledWith(helpMessage)
    expect(processExitCode).toHaveBeenCalledWith(1)
  })

  it('Should print missing keys from json files when paths for 2 valid json files are provided', async () => {
    try {
      jest
        .spyOn(fs, 'readFile')
        .mockResolvedValueOnce(String({ example: true }))
        .mockResolvedValueOnce(String({ example: true }))

      await cli(['./fake-file1.json', './fake-file2.json'])
    } catch {}

    expect(processStdoutMessage).toHaveBeenCalledWith(
      expect.stringContaining('✅ All files schema matches'),
    )
    expect(processExitCode).toHaveBeenCalledWith(0)
  })

  it('Should print the package version when the -v flag is provided', async () => {
    try {
      await cli(['--version'])
    } catch {}

    try {
      await cli(['-v'])
    } catch {}

    expect(processStdErrMessage).toHaveBeenCalledWith('development')
    expect(processStdErrMessage).toHaveBeenCalledWith('development')
  })

  it('Print error message when file is not accessible', async () => {
    jest
      .spyOn(fs, 'readFile')
      .mockRejectedValueOnce(new Error('Random File System error'))

    await expect(
      cli(['./fake-file.json', './fake-file2.json']),
    ).rejects.toThrow(
      'Could Not access file. Details Error: Random File System error',
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
      .mockResolvedValueOnce(JSON.stringify(schemaSource))
      .mockResolvedValueOnce(JSON.stringify(schemaInstance))

    try {
      await cli(['./fake-file1.json', './fake-file2.json'])
    } catch {}

    expect(processStdErrMessage).toHaveBeenCalledWith(
      expect.stringContaining('dateOfBirth'),
    )
    expect(processExitCode).toHaveBeenCalledWith(1)
  })

  it('Should print missing nested object keys', async () => {
    try {
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
        .mockResolvedValueOnce(JSON.stringify(schemaSource))
        .mockResolvedValueOnce(JSON.stringify(schemaInstance))

      await cli(['./fake-file1.json', './fake-file2.json'])
    } catch {}

    expect(processStdErrMessage).toHaveBeenCalledWith(
      expect.stringContaining('awards'),
    )
    expect(processStdErrMessage).toHaveBeenCalledWith(
      expect.stringContaining('education'),
    )
    expect(processExitCode).toHaveBeenCalledWith(1)
  })

  it('Should validate multiple files and print the errors at once', async () => {
    try {
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

      const schemaInstance2 = {
        name: 'Ted Nelson',
        achievements: {
          projects: ['hypertext', 'hypermedia'],
          awards: ['Yuri Rubinsky Memorial Award'],
        },
      }

      jest
        .spyOn(fs, 'readFile')
        .mockResolvedValueOnce(JSON.stringify(schemaSource))
        .mockResolvedValueOnce(JSON.stringify(schemaInstance))
        .mockResolvedValueOnce(JSON.stringify(schemaInstance2))

      await cli(['./fake-file1.json', './fake-file2.json', './fake-file3.json'])
    } catch {}

    const expectedErrorMessage = wrongSchemaMessage([
      {
        filePath: './fake-file2.json',
        isFileValid: false,
        fileContent: {},
        name: 'instance 1',
        errors: [
          { message: "must have required property 'awards'" },
          { message: "must have required property 'education'" },
        ],
      },
      {
        filePath: './fake-file3.json',
        isFileValid: false,
        fileContent: {},
        name: 'instance 2',
        errors: [{ message: "must have required property 'education'" }],
      },
    ])

    expect(processStdErrMessage).toHaveBeenCalledWith(expectedErrorMessage)
    expect(processExitCode).toHaveBeenCalledWith(1)
  })

  it('Should validate multiple files and print only the paths that are failing', async () => {
    try {
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

      const schemaInstance2 = {
        name: 'Ted Nelson',
        achievements: {
          projects: ['hypertext', 'hypermedia'],
          awards: ['Yuri Rubinsky Memorial Award'],
          education: {
            college: 'Harvard',
          },
        },
      }

      jest
        .spyOn(fs, 'readFile')
        .mockResolvedValueOnce(JSON.stringify(schemaSource))
        .mockResolvedValueOnce(JSON.stringify(schemaInstance))
        .mockResolvedValueOnce(JSON.stringify(schemaInstance2))

      await cli(['./fake-file1.json', './fake-file2.json', './fake-file3.json'])
    } catch {}

    const expectedErrorMessage = wrongSchemaMessage([
      {
        filePath: './fake-file2.json',
        isFileValid: false,
        fileContent: {},
        name: 'instance 1',
        errors: [
          { message: "must have required property 'awards'" },
          { message: "must have required property 'education'" },
        ],
      },
    ])

    expect(processStdErrMessage).toHaveBeenCalledWith(expectedErrorMessage)
    expect(processExitCode).toHaveBeenCalledWith(1)
  })

  it('Should validate JSONC/JSON5 files ignoring comments ', async () => {
    try {
      const schemaSource = `{
        name: 'Doug Engelbart',
        // The better we get at getting better,
        // the faster we will get better.
        achievements: {
          projects: ['mouse'],
          awards: ['Turing Award', 'MORE'],
          education: {
            college: 'Berkely',
          },
        },
      }`

      const schemaInstance = `{
        name: 'Alan Kay',
        achievements: {
          projects: ['Smalltalk'],
          awards: ['Turing Award', 'Charles Stark Draper Prize', 'Kyoto Prize'],
          education: {
            college: 'Utah',
          }
        },
      }`

      jest
        .spyOn(fs, 'readFile')
        .mockResolvedValueOnce(schemaSource)
        .mockResolvedValueOnce(schemaInstance)

      await cli(['./fake-file1.json', './fake-file2.json'])
    } catch {}

    expect(processStdoutMessage).toHaveBeenCalledWith(
      expect.stringContaining('✅ All files schema matches'),
    )
    expect(processExitCode).toHaveBeenCalledWith(0)
  })

  it('Should validate YAML against JSON files ignoring comments ', async () => {
    try {
      const schemaSource = `{
        name: 'Doug Engelbart',
        // The better we get at getting better,
        // the faster we will get better.
        achievements: {
          projects: ['mouse'],
          awards: ['Turing Award', 'MORE'],
          education: {
            college: 'Berkely',
          },
        },
      }`

      const schemaInstance = `
name: Alan Kay
achievements:
# comment here
  projects:
  - Smalltalk
  awards:
  - Turing Award
  - Charles Stark Draper Prize
  - Kyoto Prize
  education:
    college: Utah
      `

      jest
        .spyOn(fs, 'readFile')
        .mockResolvedValueOnce(schemaSource)
        .mockResolvedValueOnce(schemaInstance)

      await cli(['./fake-file1.json', './fake-file2.json'])
    } catch {}

    expect(processStdoutMessage).toHaveBeenCalledWith(
      expect.stringContaining('✅ All files schema matches'),
    )
    expect(processExitCode).toHaveBeenCalledWith(0)
  })
})
