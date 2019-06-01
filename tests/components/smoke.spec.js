import React from 'react';
import { Text } from 'react-native';
import { shallow } from 'enzyme';

describe('Text', () => {
  it('renders text', () => {
    const text = "Hollo world!";
    const wrapper = shallow(<Text>{text}</Text>);
    expect(wrapper.props().children).toBe(text);
  });
});
