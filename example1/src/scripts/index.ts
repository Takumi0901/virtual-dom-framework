import createElement from './createElement'
import render from './render'
import diff from './diff'
import { TNode } from './types'

var hoge = 1

const createVApp = (count: number) =>
  createElement('div', {
    attrs: {
      id: 'app',
      dataCount: count
    },
    children: [
      'The current count is: ',
      String(count),
      ...Array.from({ length: count }, () =>
        createElement('img', {
          attrs: {
            src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif'
          }
        })
      )
    ]
  })

export const mount = ($node: TNode, $target: HTMLElement) => {
  $target.replaceWith($node)
  return $node
}

let count = 2
let vApp = createVApp(0)
const $app = render(vApp)
let $rootEl = mount($app, document.getElementById('app'))

setInterval(() => {
  const n = Math.floor(Math.random() * 10)
  const vNewApp = createVApp(n)
  const patch = diff(vApp, vNewApp)

  $rootEl = patch($rootEl)

  vApp = vNewApp
}, 3000)
