export type TNode = Text | HTMLElement
export type NodeType = VNode | string
export type Attributes = { [s: string]: any } | ArrayLike<unknown>

export type VNode = {
  tagName?: keyof ElementTagNameMap
  attrs: Attributes
  children?: NodeType[]
}
