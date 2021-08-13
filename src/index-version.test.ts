import cli from '.'

jest.spyOn(process, 'exit').mockImplementation(() => {
  // eslint-disable-next-line no-throw-literal
  throw 'Stop Running App'
})

const processStdErrMessage = jest
  .spyOn(process.stderr, 'write')
  .mockImplementation()

jest.mock('./env', () => ({
  npmPackageVersion: 'example',
}))

test('Should print the package version when the -v flag is provided', async () => {
  try {
    await cli(['--version'])
  } catch {}

  try {
    await cli(['-v'])
  } catch {}

  expect(processStdErrMessage).toHaveBeenCalledWith('example')
  expect(processStdErrMessage).toHaveBeenCalledWith('example')
})
