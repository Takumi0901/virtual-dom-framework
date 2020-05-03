import { TNode } from './types'

export const mount = ($node: TNode, $target: HTMLElement): TNode => {
  $target.replaceWith($node)
  return $node
}
