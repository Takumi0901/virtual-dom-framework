import { NodeType, VNode } from './types'

function renderElem({ tagName, attrs, children }: VNode): HTMLElement {
  const $el = document.createElement(tagName)
  for (const [k, v] of Object.entries(attrs)) {
    $el.setAttribute(k, v)
  }

  for (const child of children) {
    $el.appendChild(render(child))
  }

  return $el
}

function render(vNode: NodeType): HTMLElement | Text {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode)
  }
  return renderElem(vNode)
}

export default render
