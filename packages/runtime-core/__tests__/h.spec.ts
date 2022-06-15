import { h } from '../src/h'
import { createVNode } from '../src/vnode'

describe('renderer: h', () => {
    test('type only', () => {
      expect(h('div')).toMatchObject(createVNode('div'))
    })
  
    test('type + props', () => {
      expect(h('div', { id: 'foo' })).toMatchObject(
        createVNode('div', { id: 'foo' })
      )
    })
})