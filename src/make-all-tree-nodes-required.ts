export type RecursiveAddRequirePropertyOnTreeNodes = (
  acc: Record<string, unknown>,
  currentValue: [string, unknown | Record<string, unknown>],
) => Record<string, unknown>

export const recursiveAddRequiredPropertyOnTreeNodes: RecursiveAddRequirePropertyOnTreeNodes =
  (acc, currentValue) => {
    const [key, value] = currentValue

    const isValueAnObject =
      (value as Record<string, unknown>)?.type === 'object'

    if (key === 'properties' || isValueAnObject) {
      const nodeValue = Object.entries(value as Record<string, unknown>).reduce(
        recursiveAddRequiredPropertyOnTreeNodes,
        {},
      )

      const required = Object.keys(value as Record<string, unknown>)
      const addRequiredKeys = required.includes('type') ? {} : { required }

      return { ...acc, [key]: nodeValue, ...addRequiredKeys }
    }

    return { ...acc, [key]: value }
  }

export const makeAllTreeNodesRequired = (
  tree: Record<string, unknown>,
): Record<string, unknown> => {
  return Object.entries(tree).reduce(
    recursiveAddRequiredPropertyOnTreeNodes,
    {},
  )
}
