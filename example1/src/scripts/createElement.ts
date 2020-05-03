import { VNode } from './types'

export default (tagName: keyof ElementTagNameMap, { attrs = {}, children = [] }: VNode): VNode => {
  const vElem = Object.create(null)

  Object.assign(vElem, {
    tagName,
    attrs,
    children
  })

  return vElem
}
