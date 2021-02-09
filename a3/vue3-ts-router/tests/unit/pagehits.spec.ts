import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'
import flushPromises from "flush-promises";
import moxios from "moxios"; // <-- life saver

// To DO: Implement moxios to pull in remote pagehits before shallow mounting the Counter component
describe('Counter.vue', () => {
  it('On mount, the component will display the remote hit count plus 1', () => {

    const wrapper = shallowMount(Counter, {
      hitcount: { 5 }, routename: { 'Page 1' }
    })
    await flushPromises();
    expect(wrapper.text()).to.include("Display Hits: " + 6);
  })
})
