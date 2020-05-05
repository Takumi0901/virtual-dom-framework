import updateElement from './updateElement'
import render from './render'
import { mount } from './mount'
import { VNode } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType<State> = (state: State) => void | any

export interface ActionTree<State> {
  [action: string]: ActionType<State>
}

export interface View<State, Actions> {
  (state: State, actions: Actions): VNode
}

interface AppConstructor<State, Actions extends ActionTree<State>> {
  /** メインNode */
  el: HTMLElement | string
  /** Viewの定義 */
  view: View<State, Actions>
  /** 状態管理 */
  state: State
  /** Actionの定義 */
  actions: Actions
}

export class App<State, Actions extends ActionTree<State>> {
  private readonly el: HTMLElement
  private readonly view: AppConstructor<State, Actions>['view']
  private readonly actions: AppConstructor<State, Actions>['actions']
  private state: AppConstructor<State, Actions>['state']
  private skipRender: boolean
  private oldNode: VNode
  private newNode: VNode
  private rootElement: HTMLElement | Text

  constructor(params: AppConstructor<State, Actions>) {
    this.el = typeof params.el === 'string' ? document.querySelector(params.el) : params.el
    this.view = params.view
    this.newNode = this.view(this.state, this.actions)
    this.state = params.state
    this.actions = this.dispatchAction(params.actions)
    this.resolveNode()
  }

  private dispatchAction(actions: Actions): Actions {
    const dispatched: ActionTree<State> = {}

    for (const key in actions) {
      const action = actions[key]

      dispatched[key] = (state: State): void => {
        this.state = action(state)
        this.resolveNode()
      }
    }

    return dispatched as Actions
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
      const patch = updateElement(this.oldNode, this.newNode)
      this.rootElement = patch(this.rootElement)
    } else {
      const patch = updateElement(this.newNode)
      this.rootElement = patch(render(this.newNode))
    }
    mount(this.rootElement, this.el)

    this.oldNode = this.newNode
    this.skipRender = false
  }
}
