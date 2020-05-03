import createElement from './createElement'
import render from './render'
import diff from './diff'
import { VNode } from './types'
import { mount } from './mount'

const state = 1

const actions: any = {
  countUp(count: any) {
    return count + 1
  }
}

const createVApp = (count: number, action: any): VNode => {
  return createElement('div', {
    attrs: {
      id: 'app',
      dataCount: count
    },
    children: [
      createElement('button', {
        attrs: {
          type: 'button',
          onclick: () => {
            action.countUp(count)
          }
        },
        children: ['hgehoghoeg']
      }),
      String(count)
      // ...Array.from({ length: count }, () =>
      //   createElement('img', {
      //     attrs: {
      //       src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif'
      //     }
      //   })
      // )
    ]
  })
}

export class App {
  private readonly el: HTMLElement
  private readonly view: any
  private state: any
  private readonly actions: any
  private skipRender: boolean
  private oldNode: any
  /** 仮想DOM（変更後用） */
  private newNode: any
  private eel: any

  constructor(params: { el: any; view: any; state: any; actions: any }) {
    this.el = typeof params.el === 'string' ? document.querySelector(params.el) : params.el
    this.view = params.view
    this.newNode = this.view(this.state, this.actions)
    this.state = params.state
    this.actions = this.dispatchAction(params.actions)
    // this.mountf()
    this.resolveNode()
  }

  private dispatchAction(actions: any): any {
    const dispatched: any = {}

    for (const key in actions) {
      const action = actions[key]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatched[key] = (state: any, ...data: any): any => {
        const ret = action(state)
        this.state = ret
        this.resolveNode()
        return ret
      }
    }

    return dispatched as any
  }

  private resolveNode(): void {
    this.newNode = this.view(this.state, this.actions)
    this.scheduleRender()
  }

  private scheduleRender(): void {
    if (!this.skipRender) {
      this.skipRender = true
      setTimeout(this.render.bind(this))
    }
  }

  private render(): void {
    if (this.oldNode) {
      const patch = diff(this.oldNode, this.newNode)
      this.eel = patch(this.eel)
      mount(this.eel, this.el)
    } else {
      const patch = diff(this.newNode, this.newNode)
      this.eel = patch(render(this.newNode))
      mount(this.eel, this.el)
    }

    this.oldNode = this.newNode
    this.skipRender = false
  }
}

new App({
  el: '#app',
  view: createVApp,
  state,
  actions
})
