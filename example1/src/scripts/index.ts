import createElement from './createElement'
import { VNode } from './types'
import { App, ActionTree, View } from './app'

type State = {
  count?: number
  text: string
}

const state: State = {
  count: 1,
  text: '仮想DOM'
}

interface Actions extends ActionTree<State> {
  countUp: (state: State) => State
  changeText: (state: State) => State
}

const actions: Actions = {
  countUp(state: State) {
    return { ...state, count: state.count + 1 }
  },
  changeText(state: State) {
    return { ...state, text: '完全に理解した' }
  }
}

const view: View<State, Actions> = (state, action): VNode => {
  return createElement('div', {
    attrs: {
      id: 'app',
      dataCount: state?.count
    },
    children: [
      createElement('button', {
        attrs: {
          type: 'button',
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          onclick: () => {
            action.countUp(state)
          }
        },
        children: ['count up']
      }),
      createElement('button', {
        attrs: {
          type: 'button',
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          onclick: () => {
            action.changeText(state)
          }
        },
        children: ['change']
      }),
      String(state?.count),
      createElement('p', {
        attrs: {},
        children: [state?.text]
      })
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

new App<State, Actions>({
  el: '#app',
  view,
  state,
  actions
})
