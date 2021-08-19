import compareSchemas, { InvalidFile } from './'
import { FileState } from './index.types'

test('It Should Validate multiple schemas, and return a list of objects containing the errors', () => {
  const schemaSource: FileState = {
    name: 'Schema Source',
    filePath: './brilliant-people.doug-engelbart.json',
    fileContent: {
      name: 'Doug Engelbart',
      achievements: {
        projects: ['mouse'],
        awards: ['Turing Award', 'MORE'],
        education: {
          college: 'Berkely',
        },
      },
    },
  }

  const schemaInstance: FileState = {
    name: 'Schema Instance1',
    filePath: './brilliant-people.alan-kay.json',
    fileContent: {
      name: 'Alan Kay',
      achievements: {
        projects: ['Smalltalk'],
        awards: ['Turing Award', 'Charles Stark Draper Prize', 'Kyoto Prize'],
      },
    },
  }

  const validatedFiles = compareSchemas(
    schemaSource,
    schemaInstance,
  ) as InvalidFile[]
  const errors = validatedFiles[0].errors.map(s => s?.message)[0]

  expect(errors).toContain('education')
})
