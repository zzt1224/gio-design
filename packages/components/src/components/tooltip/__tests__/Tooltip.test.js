import React from 'react';
import Tooltip from '../index';
import '@gio-design/components/es/components/Tabs/style/index.css';
import { mount, render } from 'enzyme';
import getPlacements, { getOverflowOptions } from '../placements';
import { isEqual } from 'lodash';
import { waitForComponentToPaint } from '../../../utils/test';


describe('Testing Tooltip', () => {
  const getTooltip = () => (
    <Tooltip title="This is a test" tooltipLink={{ name: '点击这里', link: 'https://www.growingio.com' }}>
      <span>Test</span>
    </Tooltip>
  );

  it('should be stable', () => {
    const wrapper = render(getTooltip());
    expect(wrapper).toMatchSnapshot();
  });

  it('should be mount, setProps, unmount with no error', () => {
    expect(() => {
      const wrapper = mount(getTooltip());
      wrapper.setProps({ title: 'set props' });
      wrapper.setProps({ visible: 'true' });
      wrapper.setProps({ tooltipLink: { name: '点击这里', link: 'https://www.growingio.com/about' } });
      wrapper.unmount();
    }).not.toThrow();
  });

  test('props title', () => {
    const wrapper = mount(getTooltip());
    wrapper.setProps({ visible: true });
    wrapper.setProps({ title: '更换文字' });
    expect(wrapper.find('.gio-tooltip-inner').find('span').text()).toBe('更换文字');
  });

  test('props tooltipLink', () => {
    const wrapper = mount(getTooltip());
    wrapper.setProps({ visible: true });
    wrapper.setProps({ tooltipLink: { name: '点击这里', link: 'https://www.growingio.com/about' } });
    expect(
      wrapper
        .find('.gio-tooltip-inner')
        .find('a')
        .filterWhere((item) => item.prop('href') === 'https://www.growingio.com/about')
    ).toHaveLength(1);
  });

  test('props disabled', () => {
    const wrapper = mount(getTooltip());
    wrapper.setProps({ disabled: true, title: '测试disabled' });
    wrapper.find('span').at(0).simulate('mouseenter');
    expect(wrapper.exists('.gio-tooltip')).toBe(false);
  });

  test('title content should be render', (done) => {
    const wrapper = mount(getTooltip());
    wrapper.setProps({ visible: true });
    wrapper.setProps({ title: '' });
    waitForComponentToPaint(wrapper).then(() => {
      expect(wrapper.exists('.gio-tooltip')).toBe(false);
      done();
    });
    wrapper.setProps({ title: null });
    waitForComponentToPaint(wrapper).then(() => {
      expect(wrapper.exists('.gio-tooltip')).toBe(false);
      done();
    });
  });

  test('props trigger', () => {
    const wrapper = mount(getTooltip());
    wrapper.setProps({ trigger: 'click' });
    wrapper.find('span').at(0).simulate('click');
    expect(wrapper.exists('.gio-tooltip-inner')).toBe(true);
  });

  test('props placement', (done) => {
    const wrapper = mount(getTooltip());
    wrapper.setProps({ visible: true, placement: 'topLeft' });
    waitForComponentToPaint(wrapper, 2000).then(() => {
      expect(wrapper.exists('.gio-tooltip-placement-topLeft')).toBe(true);
      done();
    });
  });

  test('props overlayClassName', () => {
    const wrapper = mount(getTooltip());
    wrapper.setProps({ visible: true });
    wrapper.setProps({ overlayClassName: 'overlayClassName' });
    expect(wrapper.exists('.overlayClassName')).toBe(true);
  });

  test('props onVisibleChange', () => {
    let called = false;
    const wrapper = mount(getTooltip());
    wrapper.setProps({
      onVisibleChange: () => (called = true),
    });
    wrapper.setProps({ trigger: 'click' });
    wrapper.find('span').at(0).simulate('click');
    expect(called).toBe(true);
  });

  it('should be render rightly', (done) => {
    const wrapper = mount(getTooltip());
    wrapper.setProps({ trigger: 'click' });
    wrapper.setProps({ placement: 'topLeft' });
    wrapper.setProps({ overlayClassName: 'overlayClassName' });
    wrapper.find('span').at(0).simulate('click');
    expect(wrapper.exists('.gio-tooltip-inner')).toBe(true);
    expect(wrapper.find('.gio-tooltip-inner').find('span').text()).toBe('This is a test');
    expect(
      wrapper
        .find('.gio-tooltip-inner')
        .find('a')
        .filterWhere((item) => item.prop('href') === 'https://www.growingio.com')
    ).toHaveLength(1);
    expect(wrapper.exists('.overlayClassName')).toBe(true);
    waitForComponentToPaint(wrapper).then(() => {
      expect(wrapper.exists('.gio-tooltip-placement-topLeft')).toBe(true);
      done();
    });
  });

  test('getOverflowOptions function', () => {
    const result1 = getOverflowOptions({ adjustX: 1 });
    expect(result1.adjustX).toBe(1);
    expect(result1.adjustY).toBe(0);
    const result2 = getOverflowOptions(true);
    expect(result2.adjustX).toBe(1);
    expect(result2.adjustY).toBe(1);
    const result3 = getOverflowOptions(false);
    expect(result3.adjustX).toBe(0);
    expect(result3.adjustY).toBe(0);
  });

  test('getPlacements function', () => {
    const placements = getPlacements({ arrowPointAtCenter: true });
    expect(placements.top.points).not.toBeUndefined();
    expect(placements.top.offset).not.toBeUndefined();
    expect(placements.top.overflow).not.toBeUndefined();
    expect(placements.top.targetOffset).not.toBeUndefined();
    expect(isEqual(getPlacements({ arrowPointAtCenter: false }).topLeft.offset, placements.topLeft.offset)).toBe(false);
  });
});
