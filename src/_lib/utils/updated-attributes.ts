import { FindAttributeOptions } from 'sequelize'

export function updatedAttributes(
  initAttributes: FindAttributeOptions,
  attributes?: FindAttributeOptions
) {
  let result: Record<string, any> | string[] = {}
  switch (true) {
    case Array.isArray(initAttributes):
      switch (true) {
        case Array.isArray(attributes):
          result = initAttributes.concat(attributes)
          break

        case typeof attributes === 'object':
          result = {
            exclude: attributes.exclude,
            include: initAttributes.concat(attributes.include as any),
          }
          break
        default:
          result = initAttributes
          break
      }
      break

    case typeof initAttributes === 'object':
      switch (true) {
        case Array.isArray(attributes):
          result = {
            exclude: initAttributes.exclude,
            include: (initAttributes.include as any).concat(attributes),
          }
          break

        case typeof attributes === 'object':
          result = {
            exclude: (initAttributes.exclude as any).concat(
              attributes.exclude as any
            ),
            include: (initAttributes.include as any).concat(
              attributes.include as any
            ),
          }
          break
        default:
          result = {
            exclude: initAttributes.exclude,
            include: initAttributes.include,
          }
          break
      }
      break
  }
  return result as FindAttributeOptions
}
