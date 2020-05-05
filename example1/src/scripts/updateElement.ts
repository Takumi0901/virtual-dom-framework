import render from './render'
import { NodeType, Attributes } from './types'

const zip = (xs: string | any[], ys: string | any[] | NodeListOf<ChildNode>): any => {
  const zipped = []
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]])
  }
  return zipped
}

const updateAttrs = (oldAttrs: Attributes, newAttrs: Attributes): (($node: HTMLElement) => HTMLElement) => {
  const patches: {
    ($node: HTMLElement): HTMLElement
    ($node: HTMLElement): HTMLElement
  }[] = []

  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node: HTMLElement) => {
      if (k === 'onclick') {
        $node.addEventListener('click', v as EventListener)
      } else {
        $node.setAttribute(k, v)
      }

      return $node
    })
  }

  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node: HTMLElement) => {
        $node.removeAttribute(k)
        return $node
      })
    }
  }

  return ($node: HTMLElement): HTMLElement => {
    for (const patch of patches) {
      patch($node)
    }
    return $node
  }
}

const updateChildren = (oldVChildren: NodeType[], newVChildren: NodeType[]): any => {
  const childPatches: (($node: HTMLElement) => any)[] = []
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(updateElement(oldVChild, newVChildren[i]))
  })

  const additionalPatches: (($node: HTMLElement) => any)[] = []
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(additionalVChild))
      return $node
    })
  }

  return ($parent: HTMLElement): HTMLElement => {
    for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
      patch($child)
    }

    for (const patch of additionalPatches) {
      patch($parent)
    }
    return $parent
  }
}

const updateElement = (
  oldVTree: NodeType,
  newVTree?: NodeType
): (($node: Text | HTMLElement) => Text | HTMLElement) => {
  const upd = newVTree || oldVTree

  if (upd === undefined) {
    return ($node: HTMLElement): undefined => {
      $node.remove()
      return undefined
    }
  }

  if (typeof oldVTree === 'string' || typeof upd === 'string') {
    if (oldVTree !== upd) {
      return ($node: Text | HTMLElement): Text | HTMLElement => {
        const $newNode = render(upd)
        $node.replaceWith($newNode)
        return $newNode
      }
    } else {
      return ($node: HTMLElement): HTMLElement => $node
    }
  }

  if (oldVTree.tagName !== upd.tagName) {
    return ($node: Text | HTMLElement): Text | HTMLElement => {
      const $newNode = render(upd)
      $node.replaceWith($newNode)
      return $newNode
    }
  }

  const patchAttrs = updateAttrs(oldVTree.attrs, upd.attrs)
  const patchChildren = updateChildren(oldVTree.children, upd.children)

  return ($node: HTMLElement): HTMLElement => {
    patchAttrs($node)
    patchChildren($node)
    return $node
  }
}

export default updateElement
