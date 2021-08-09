declare module 'generate-schema' {
  function json(schemaSource: Record<string, unknown>): Record<string, unknown>

  namespace GenerateSchema {
    export { json }
  }
}
