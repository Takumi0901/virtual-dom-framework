import { TNode } from './types'

export const mount = ($node: TNode, $target: HTMLElement): TNode => {
  console.log('*****************')
  console.log($target)
  console.log('*****************')
  $target.replaceWith($node)
  console.log('mount *****************')
  console.log($node)
  console.log('*****************')
  return $node
}
